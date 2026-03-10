"""
Інкрементні міграції схеми бази даних.

При першому запуску на нових базах Base.metadata.create_all() сам створить усі
таблиці з потрібними колонками.  Для *існуючих* баз (де, наприклад, `bicycles`
вже є, але колонок `year`/`color` ще немає) застосовуємо ALTER TABLE.
SQLite не підтримує IF NOT EXISTS для ALTER TABLE, тому просто ловимо
OperationalError «duplicate column name».
"""
import logging

from sqlalchemy import text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)

# Список SQL-команд для додавання нових колонок до існуючих таблиць.
# Нові таблиці (tariffs, clients, routes, …) Base.metadata.create_all() створить сам.
_ALTER_STATEMENTS = [
    # bicycles: нові поля ВелоХаус
    "ALTER TABLE bicycles ADD COLUMN year INTEGER",
    "ALTER TABLE bicycles ADD COLUMN color VARCHAR",
    # rentals: зв'язки з тарифом, клієнтом, маршрутом та часовими мітками
    "ALTER TABLE rentals ADD COLUMN tariff_id INTEGER REFERENCES tariffs(id)",
    "ALTER TABLE rentals ADD COLUMN client_id INTEGER REFERENCES clients(id)",
    "ALTER TABLE rentals ADD COLUMN route_id  INTEGER REFERENCES routes(id)",
    "ALTER TABLE rentals ADD COLUMN start_time DATETIME",
    "ALTER TABLE rentals ADD COLUMN end_time   DATETIME",
]


def run_migrations(engine: Engine) -> None:
    """Безпечно додає нові колонки до існуючих таблиць.

    All ALTER TABLE statements are attempted inside individual try/except blocks
    so that a pre-existing column (OperationalError: duplicate column name) does
    not abort subsequent statements.  Because each statement is a DDL operation
    that SQLite auto-commits, there is nothing to roll back on failure.
    """
    with engine.connect() as conn:
        for stmt in _ALTER_STATEMENTS:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception:
                # Column already exists or table doesn't exist yet — safe to ignore.
                conn.rollback()
