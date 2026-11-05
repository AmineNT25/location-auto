from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr, ValidationError
from sqlalchemy.exc import OperationalError

from app.core.config import Settings
from app.db.session import get_session
from app.main import create_app


def make_app(**overrides):
    return create_app(Settings(_env_file=None, database_url=None, **overrides))


def test_liveness_without_database():
    with TestClient(make_app()) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_readiness_without_database():
    with TestClient(make_app()) as client:
        response = client.get("/api/v1/health/ready")
        assert response.status_code == 503
        assert response.json() == {"status": "unavailable", "database": "unavailable"}


@pytest.mark.parametrize("available", [True, False])
def test_readiness_checks_database_and_cleans_dependency(available):
    application = make_app()
    cleaned = []

    class Database:
        def execute(self, statement):
            assert str(statement) == "SELECT 1"
            if not available:
                raise OperationalError("secret host", {}, Exception("private password"))

    def database_override() -> Iterator[Database]:
        try:
            yield Database()
        finally:
            cleaned.append(True)

    application.dependency_overrides[get_session] = database_override
    with TestClient(application) as client:
        response = client.get("/api/v1/health/ready")
        assert response.status_code == (200 if available else 503)
        assert response.json() == (
            {"status": "ready", "database": "connected"} if available
            else {"status": "unavailable", "database": "unavailable"}
        )
        assert "secret" not in response.text and "private" not in response.text
    assert cleaned == [True]


def test_real_unreachable_database_does_not_break_liveness():
    # TCP port 1 on loopback is deliberately not a PostgreSQL service.
    settings = Settings(
        _env_file=None,
        database_url=SecretStr("postgresql+psycopg://test:placeholder@127.0.0.1:1/test"),
        database_connect_timeout=1,
    )
    with TestClient(create_app(settings)) as client:
        assert client.get("/api/v1/health").status_code == 200
        response = client.get("/api/v1/health/ready")
        assert response.status_code == 503
        assert response.json() == {"status": "unavailable", "database": "unavailable"}


def test_cors_allows_only_configured_development_origins():
    with TestClient(make_app()) as client:
        allowed = client.get("/api/v1/health", headers={"Origin": "http://127.0.0.1:5173"})
        assert allowed.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"
        denied = client.get("/api/v1/health", headers={"Origin": "https://untrusted.example"})
        assert "access-control-allow-origin" not in denied.headers
        denied_null = client.get("/api/v1/health", headers={"Origin": "null"})
        assert "access-control-allow-origin" not in denied_null.headers


@pytest.mark.parametrize("origins", [["*"], ["null"], ["https://example.com/path"]])
def test_invalid_cors_origins_rejected(origins):
    with pytest.raises(ValidationError):
        Settings(_env_file=None, cors_origins=origins)


def test_production_requires_explicit_secure_origins():
    with pytest.raises(ValidationError):
        Settings(_env_file=None, environment="production")
    assert Settings(_env_file=None, environment="production", cors_origins=[])


def test_invalid_database_driver_rejected_without_exposing_url():
    with pytest.raises(ValidationError) as error:
        Settings(_env_file=None, database_url="mysql://private:secret@example.com/db")
    assert "secret" not in str(error.value)


def test_engine_disposed_and_real_session_closed(monkeypatch):
    application = make_app()
    disposed = []

    class Engine:
        def dispose(self):
            disposed.append(True)

    application.state.engine = Engine()
    with TestClient(application):
        pass
    assert disposed == [True]

    # Exercise the production dependency's context manager, including failure cleanup.
    entered, exited = [], []

    class SessionContext:
        def __init__(self, engine):
            pass

        def __enter__(self):
            entered.append(True)
            return self

        def __exit__(self, *args):
            exited.append(True)

        def execute(self, statement):
            raise OperationalError("SELECT 1", {}, Exception("private connection info"))

    monkeypatch.setattr("app.db.session.Session", SessionContext)
    with TestClient(application) as client:
        assert client.get("/api/v1/health/ready").status_code == 503
    assert entered == exited == [True]
