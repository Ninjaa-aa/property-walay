"""
Local audio transcription service using faster-whisper.

Runs a singleton WhisperModel lazily (first request triggers ~3-5s model load
into RAM; subsequent requests are fast). Inference is offloaded to a worker
thread so the FastAPI event loop remains responsive.
"""

from __future__ import annotations

import asyncio
import logging
import os
import tempfile
import threading
from typing import Optional

from fastapi import HTTPException, UploadFile, status

from app.core.configs.config import settings
from app.schemas.chatbot import TranscriptionResponse

logger = logging.getLogger(__name__)

_model = None
_model_lock = threading.Lock()

ALLOWED_AUDIO_MIME_PREFIX = "audio/"


def _get_model():
    """Lazily load (and cache) the WhisperModel instance."""
    global _model
    if _model is not None:
        return _model

    with _model_lock:
        if _model is not None:
            return _model

        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            logger.error("faster-whisper not installed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Speech-to-text engine is not installed on the server.",
            )

        logger.info(
            "Loading Whisper model '%s' on %s (compute_type=%s)",
            settings.WHISPER_MODEL,
            settings.WHISPER_DEVICE,
            settings.WHISPER_COMPUTE_TYPE,
        )
        _model = WhisperModel(
            settings.WHISPER_MODEL,
            device=settings.WHISPER_DEVICE,
            compute_type=settings.WHISPER_COMPUTE_TYPE,
        )
        return _model


ALLOWED_LANGUAGES = ("ur", "en")


def _detect_language(model, path: str) -> Optional[str]:
    """
    Restrict Whisper language detection to Urdu / English only.

    Whisper frequently misidentifies Urdu speech as Hindi because the two
    share phonetics. We pull the full per-language probability distribution
    and pick the highest score within our allow-list.
    """
    try:
        result = model.detect_language(
            path,
            language_detection_segments=2,
        )
    except TypeError:
        try:
            result = model.detect_language(path)
        except Exception as exc:
            logger.warning("detect_language failed: %s", exc)
            return None
    except Exception as exc:
        logger.warning("detect_language failed: %s", exc)
        return None

    all_probs = None
    if isinstance(result, tuple):
        if len(result) >= 3:
            all_probs = result[2]
    if isinstance(all_probs, list) and all_probs:
        all_probs = all_probs[0]
    if not isinstance(all_probs, dict):
        return None

    best: Optional[str] = None
    best_score = -1.0
    for code in ALLOWED_LANGUAGES:
        score = float(all_probs.get(code, 0.0))
        if score > best_score:
            best_score = score
            best = code
    return best


def _run_transcription(path: str) -> tuple[str, Optional[str], Optional[float]]:
    """
    Blocking helper that calls faster-whisper. Returns (text, language, duration).
    Meant to be invoked via asyncio.to_thread.
    """
    model = _get_model()

    language = _detect_language(model, path) or "ur"

    segments, info = model.transcribe(
        path,
        beam_size=1,
        vad_filter=True,
        language=language,
        task="transcribe",
    )
    text = " ".join(segment.text.strip() for segment in segments).strip()
    detected = getattr(info, "language", None) or language
    duration = getattr(info, "duration", None)
    return text, detected, duration


async def transcribe_audio(upload: UploadFile) -> TranscriptionResponse:
    """Validate and transcribe an uploaded audio file."""
    content_type = (upload.content_type or "").lower()
    if not content_type.startswith(ALLOWED_AUDIO_MIME_PREFIX):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported content type: {upload.content_type!r}. Expected audio/*.",
        )

    max_bytes = settings.WHISPER_MAX_AUDIO_MB * 1024 * 1024
    audio_bytes = await upload.read()
    if len(audio_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file is empty.",
        )
    if len(audio_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file exceeds {settings.WHISPER_MAX_AUDIO_MB} MB limit.",
        )

    suffix = _extension_for_mime(content_type)
    tmp_path: Optional[str] = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        text, language, duration = await asyncio.to_thread(
            _run_transcription, tmp_path
        )

        if duration and duration > settings.WHISPER_MAX_DURATION_SECONDS:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"Audio duration {duration:.1f}s exceeds "
                    f"{settings.WHISPER_MAX_DURATION_SECONDS}s limit."
                ),
            )

        return TranscriptionResponse(
            text=text,
            language=language,
            duration=duration,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Transcription failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to transcribe audio.",
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                logger.warning("Could not delete temp audio file: %s", tmp_path)


def _extension_for_mime(mime: str) -> str:
    if "webm" in mime:
        return ".webm"
    if "ogg" in mime:
        return ".ogg"
    if "wav" in mime or "wave" in mime:
        return ".wav"
    if "mpeg" in mime or "mp3" in mime:
        return ".mp3"
    if "mp4" in mime or "m4a" in mime:
        return ".m4a"
    return ".bin"
