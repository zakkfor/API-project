"""
Endpoint /info — повертає безпечну інформацію про базу даних
(тип, ім'я, ORM, список таблиць) без розкриття паролів або хостів.
"""
from fastapi import APIRouter
from sqlalchemy import MetaData, Table, func, inspect, select

from app.database import engine

router = APIRouter()


def _db_info() -> dict:
    """Збирає мета-інформацію про поточне підключення до БД."""
    # Визначаємо тип БД
    dialect = engine.dialect.name  # "sqlite" | "postgresql" | "mysql" …

    # Безпечна назва: для SQLite — ім'я файлу, для решти — ім'я БД без хосту/пароля
    if dialect == "sqlite":
        db_name = engine.url.database or "in-memory"
    else:
        db_name = engine.url.database or dialect

    # Список таблиць через SQLAlchemy Inspector
    try:
        inspector = inspect(engine)
        tables = sorted(inspector.get_table_names())
    except Exception:
        tables = []

    # Кількість рядків у кожній таблиці (тільки для SQLite — через відображені об'єкти)
    row_counts: dict[str, int] = {}
    if dialect == "sqlite" and tables:
        try:
            meta = MetaData()
            meta.reflect(bind=engine, only=tables)
            with engine.connect() as conn:
                for t in tables:
                    table_obj = meta.tables.get(t)
                    if table_obj is None:
                        row_counts[t] = -1
                        continue
                    try:
                        result = conn.execute(select(func.count()).select_from(table_obj))
                        row_counts[t] = result.scalar() or 0
                    except Exception:
                        row_counts[t] = -1
        except Exception:
            pass

    return {
        "db_type": dialect.upper(),
        "db_name": db_name,
        "orm": "SQLAlchemy",
        "tables": tables,
        "row_counts": row_counts,
    }


@router.get("/info", tags=["info"])
async def app_info() -> dict:
    """
    Повертає інформацію про базу даних:
    - Тип (SQLite / PostgreSQL / …)
    - Назву бази / файлу
    - ORM
    - Список таблиць та кількість записів у кожній (для SQLite)
    """
    return _db_info()
