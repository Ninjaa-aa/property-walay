from fastapi import APIRouter, File, HTTPException, UploadFile, status
import httpx
import logging

from app.schemas.chatbot import (
    ChatQueryRequest,
    ChatQueryResponse,
    TranscriptionResponse,
)
from app.services.chatbot.chatbot_service import forward_query
from app.services.chatbot.transcription_service import transcribe_audio

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/query", response_model=list[ChatQueryResponse])
async def chat_query(body: ChatQueryRequest):
    """
    Accept a natural-language query, forward it to the n8n webhook,
    and return normalized results (property cards or text).
    """
    try:
        return await forward_query(body.query)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
    except httpx.HTTPStatusError as exc:
        logger.error("Webhook returned %s: %s", exc.response.status_code, exc.response.text)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Chatbot service returned an error",
        )
    except httpx.RequestError as exc:
        logger.error("Webhook request failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach chatbot service",
        )


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(file: UploadFile = File(...)):
    """
    Accept an uploaded audio file, run local Whisper transcription,
    and return the recognized text for the user to review before sending.
    """
    return await transcribe_audio(file)
