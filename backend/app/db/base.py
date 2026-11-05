from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Import future models into Alembic env.py so metadata includes them."""
