from collections.abc import Iterator

from fastapi import Request
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

from app.core.config import Settings


def build_engine(settings: Settings) -> Engine | None:
    # Constructing an engine does not open a connection: liveness needs no database.
    if settings.database_url is None:
        return None
    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=5,
        pool_timeout=3,
        connect_args={
            "connect_timeout": settings.database_connect_timeout,
            "options": "-c statement_timeout=3000",
        },
        hide_parameters=True,
    )


def get_session(request: Request) -> Iterator[Session | None]:
    engine = request.app.state.engine
    if engine is None:
        yield None
    else:
        # close() rolls back outstanding transactions and returns the connection to the pool.
        with Session(engine) as session:
            yield session
