from fastapi import APIRouter, HTTPException, status
import httpx
import logging

from app.schemas.meeting import MeetingScheduleRequest, MeetingScheduleResponse
from app.services.meeting.meeting_service import schedule_meeting

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("/schedule", response_model=MeetingScheduleResponse)
async def schedule(body: MeetingScheduleRequest):
    """
    Forward a meeting request to the n8n meetings webhook and return
    normalized status + message.
    """
    try:
        return await schedule_meeting(body.user_id, body.property_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
    except httpx.HTTPStatusError as exc:
        logger.error(
            "Meeting webhook returned %s: %s",
            exc.response.status_code,
            exc.response.text,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Meeting service returned an error",
        )
    except httpx.RequestError as exc:
        logger.error("Meeting webhook request failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach meeting service",
        )
