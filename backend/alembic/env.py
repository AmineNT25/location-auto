from alembic import context
from sqlalchemy import create_engine, pool

from app.core.config import Settings
from app.db.base import Base

settings = Settings()
if settings.database_url is None:
    raise RuntimeError("Set DATABASE_URL before running migrations")
database_url = settings.database_url.get_secret_value()
target_metadata = Base.metadata

if context.is_offline_mode():
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()
else:
    engine = create_engine(database_url, poolclass=pool.NullPool, hide_parameters=True)
    try:
        with engine.connect() as connection:
            context.configure(
                connection=connection, target_metadata=target_metadata, compare_type=True
            )
            with context.begin_transaction():
                context.run_migrations()
    finally:
        engine.dispose()
