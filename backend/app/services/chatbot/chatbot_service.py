import httpx
import logging
from typing import Any

from app.core.configs.config import settings
from app.schemas.chatbot import ChatQueryResponse

logger = logging.getLogger(__name__)

WEBHOOK_TIMEOUT = 30.0


async def forward_query(query: str) -> list[ChatQueryResponse]:
    """Forward user query to n8n webhook and normalize the response."""
    if not settings.CHATBOT_WEBHOOK_URL:
        raise ValueError("CHATBOT_WEBHOOK_URL is not configured")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            settings.CHATBOT_WEBHOOK_URL,
            json={"Query": query},
            timeout=WEBHOOK_TIMEOUT,
        )
        resp.raise_for_status()
        raw: list[dict[str, Any]] = resp.json()

    return _normalize_response(raw)


def _normalize_response(raw: list[dict[str, Any]]) -> list[ChatQueryResponse]:
    """Convert raw webhook array into typed response items."""
    results: list[ChatQueryResponse] = []

    for item in raw:
        if "properties" in item and "filters" in item:
            results.append(
                ChatQueryResponse(
                    type="properties",
                    filters=item["filters"],
                    properties=item["properties"],
                )
            )
        elif "Response" in item:
            results.append(
                ChatQueryResponse(
                    type="text",
                    text=item["Response"],
                )
            )
        else:
            logger.warning("Unknown webhook response item: %s", item)

    return results
