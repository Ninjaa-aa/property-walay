from pydantic import BaseModel, Field
from typing import Any, Optional
from uuid import UUID


class MeetingScheduleRequest(BaseModel):
    user_id: UUID = Field(..., description="Supabase auth user id of requester")
    property_id: UUID = Field(..., description="Target property id")


class MeetingScheduleResponse(BaseModel):
    status: str = Field(..., description="Webhook status (e.g. 'completed')")
    message: Optional[str] = Field(None, description="Human-readable reply text")
    raw: Any = Field(None, description="Raw webhook payload for audit/storage")
