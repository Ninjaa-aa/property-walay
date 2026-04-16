import httpx
import logging
import json
from typing import Any
from uuid import UUID

from app.core.configs.config import settings
from app.schemas.meeting import MeetingScheduleResponse

logger = logging.getLogger(__name__)

WEBHOOK_TIMEOUT = 30.0


def _normalize_message(value: Any) -> str | None:
    """
    Normalize webhook text payload.
    - If plain string, return trimmed.
    - If stringified JSON object, prefer buyer-facing message keys.
    """
    if not isinstance(value, str):
        return None

    text = value.strip()
    if not text:
        return None

    # Some n8n responses wrap role-specific messages as a JSON string.
    if text.startswith("{") and text.endswith("}"):
        try:
            parsed = json.loads(text)
            if isinstance(parsed, dict):
                for key in ("Buyer", "buyer", "buyer_message", "message"):
                    candidate = parsed.get(key)
                    if isinstance(candidate, str) and candidate.strip():
                        return candidate.strip()
        except json.JSONDecodeError:
            pass

    return text


def _extract_status_and_message(raw: Any) -> tuple[str, str | None]:
    """
    Parse n8n webhook response shape:
    [
      {
        "output": [
          {
            "status": "completed",
            "content": [{ "type": "output_text", "text": "..." }],
            ...
          }
        ]
      }
    ]
    Falls back to 'unknown' status and None message when shape differs.
    """
    try:
        first = raw[0] if isinstance(raw, list) and raw else raw
        output = first.get("output") if isinstance(first, dict) else None
        entry = output[0] if isinstance(output, list) and output else None
        if not isinstance(entry, dict):
            return "unknown", None

        status = str(entry.get("status") or "unknown")

        message: str | None = None
        content = entry.get("content")
        if isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get("text"):
                    message = _normalize_message(block["text"])
                    break

        return status, message
    except Exception as exc:
        logger.warning("Could not parse meeting webhook response: %s", exc)
        return "unknown", None


async def schedule_meeting(
    user_id: UUID, property_id: UUID
) -> MeetingScheduleResponse:
    """Forward meeting request to n8n webhook and return normalized response."""
    if not settings.MEETING_WEBHOOK_URL:
        raise ValueError("MEETING_WEBHOOK_URL is not configured")

    payload = {
        "User Id": str(user_id),
        "Property Id": str(property_id),
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            settings.MEETING_WEBHOOK_URL,
            json=payload,
            timeout=WEBHOOK_TIMEOUT,
        )
        resp.raise_for_status()
        raw = resp.json()

    status, message = _extract_status_and_message(raw)
    return MeetingScheduleResponse(status=status, message=message, raw=raw)
