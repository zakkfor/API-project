"""
Налаштування бази даних SQLAlchemy
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# Railway's Postgres plugin injects DATABASE_URL with the legacy "postgres://" scheme.
# SQLAlchemy 2.x requires "postgresql://", so normalise the URL at startup.
_db_url = settings.DATABASE_URL
if _db_url.startswith("postgres://"):
    _db_url = "postgresql://" + _db_url[len("postgres://"):]

# check_same_thread is a SQLite-only option; omit it for other databases.
_connect_args = {"check_same_thread": False} if _db_url.lower().startswith("sqlite") else {}

engine = create_engine(_db_url, connect_args=_connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency для отримання сесії бази даних"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
