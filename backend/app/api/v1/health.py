from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_session

router = APIRouter(prefix="/health", tags=["health"])


class Liveness(BaseModel):
    status: Literal["ok"] = "ok"


class Readiness(BaseModel):
    status: Literal["ready", "unavailable"]
    database: Literal["connected", "unavailable"]


@router.get("", response_model=Liveness)
def live() -> Liveness:
    return Liveness()


@router.get("/ready", response_model=Readiness, responses={503: {"model": Readiness}})
def ready(
    response: Response,
    session: Annotated[Session | None, Depends(get_session)],
) -> Readiness:
    if session is not None:
        try:
            session.execute(text("SELECT 1"))
            return Readiness(status="ready", database="connected")
        except SQLAlchemyError:
            # Never return or log driver exceptions containing connection details.
            pass
    response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return Readiness(status="unavailable", database="unavailable")
