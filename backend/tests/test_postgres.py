import os

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


@pytest.mark.integration
def test_live_postgresql_readiness():
    url = os.environ.get("TEST_DATABASE_URL")
    if not url:
        pytest.skip("Set TEST_DATABASE_URL to a running local PostgreSQL database")
    with TestClient(create_app(Settings(_env_file=None, database_url=url))) as client:
        assert client.get("/api/v1/health").status_code == 200
        response = client.get("/api/v1/health/ready")
        assert response.status_code == 200
        assert response.json() == {"status": "ready", "database": "connected"}
