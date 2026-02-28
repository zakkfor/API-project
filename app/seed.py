"""
Початкове заповнення бази даних демонстраційними велосипедами.
Викликається при старті додатку; нічого не робить, якщо дані вже є.
"""
import logging

from app.config import settings
from app.database import SessionLocal
from app.crud.user import get_user_by_username, create_user, create_admin_user
from app.crud.bicycle import get_bicycles, create_bicycle
from app.schemas.user import UserCreate
from app.schemas.bicycle import BicycleCreate

logger = logging.getLogger(__name__)

# Адміністратори, яким дозволено додавати та видаляти велосипеди.
# Список читається з env-змінної ADMIN_CREDENTIALS (формат: "user:pass,user2:pass2").
def _parse_admin_users() -> list[dict]:
    admins = []
    for entry in settings.ADMIN_CREDENTIALS.split(","):
        entry = entry.strip()
        if ":" not in entry:
            logger.warning("Skipping malformed ADMIN_CREDENTIALS entry (expected 'username:password'): %r", entry)
            continue
        username, password = entry.split(":", 1)
        username = username.strip()
        admins.append({
            "username": username,
            "email": f"{username}@bikehouse.ua",
            "password": password.strip(),
        })
    return admins

SEED_BIKES: list[BicycleCreate] = [
    BicycleCreate(
        name="Trek Marlin 7",
        brand="Trek",
        model="Marlin 7",
        type="mountain",
        price_per_hour=85.0,
        description="Надійний гірський велосипед для трейлів і позашляхового катання. Алюмінієва рама, 29-дюймові колеса, гідравлічні дискові гальма.",
        is_available=True,
        image_url="/static/bikes/mountain.svg",
    ),
    BicycleCreate(
        name="Giant Escape 3",
        brand="Giant",
        model="Escape 3",
        type="city",
        price_per_hour=55.0,
        description="Легкий міський гібрид для щоденних поїздок. Зручна посадка, крила та багажник у комплекті.",
        is_available=True,
        image_url="/static/bikes/city.svg",
    ),
    BicycleCreate(
        name="Specialized Allez",
        brand="Specialized",
        model="Allez Sport",
        type="road",
        price_per_hour=120.0,
        description="Класичне шосейне шасі з алюмінієвою рамою та карбоновою вилкою. Shimano Claris 16 швидкостей.",
        is_available=True,
        image_url="/static/bikes/road.svg",
    ),
    BicycleCreate(
        name="Mongoose Title Pro",
        brand="Mongoose",
        model="Title Pro",
        type="bmx",
        price_per_hour=40.0,
        description="Професійний BMX для скейт-парків та вуличних трюків. Хроммолібденова рама, сталеві пеги.",
        is_available=True,
        image_url="/static/bikes/bmx.svg",
    ),
    BicycleCreate(
        name="Cannondale Quick Neo",
        brand="Cannondale",
        model="Quick Neo SL 2",
        type="electric",
        price_per_hour=150.0,
        description="Швидкий електричний гібрид з мотором Bosch. Запас ходу до 100 км, заряджається за 4 години.",
        is_available=True,
        image_url="/static/bikes/electric.svg",
    ),
    BicycleCreate(
        name="Scott Aspect 950",
        brand="Scott",
        model="Aspect 950",
        type="mountain",
        price_per_hour=70.0,
        description="Доступний гірський велосипед для початківців. 27,5 дюйма, 21 передача, механічні дискові гальма.",
        is_available=True,
        image_url="/static/bikes/mountain.svg",
    ),
    BicycleCreate(
        name="Merida Crossway 100",
        brand="Merida",
        model="Crossway 100",
        type="city",
        price_per_hour=50.0,
        description="Універсальний кросовий велосипед для асфальту та ґрунтових доріжок. Shimano Tourney 21 ск.",
        is_available=False,
        image_url="/static/bikes/city.svg",
    ),
    BicycleCreate(
        name="Trek Émonda ALR 5",
        brand="Trek",
        model="Émonda ALR 5",
        type="road",
        price_per_hour=140.0,
        description="Легке шосейне рішення для тривалих поїздок. Алюмінієва рама з карбоновою вилкою, Shimano 105.",
        is_available=True,
        image_url="/static/bikes/road.svg",
    ),
    BicycleCreate(
        name="Haibike AllMtn 3",
        brand="Haibike",
        model="AllMtn 3",
        type="electric",
        price_per_hour=175.0,
        description="Електричний гірський байк з мотором Yamaha PW-X3. Ідеальний для екстремальних спусків.",
        is_available=True,
        image_url="/static/bikes/electric.svg",
    ),
    BicycleCreate(
        name="Colony Premise",
        brand="Colony",
        model="Premise",
        type="bmx",
        price_per_hour=35.0,
        description="Street BMX для фрістайлу. Цільнозварена хром-молі рама, 4-стояковий руль.",
        is_available=True,
        image_url="/static/bikes/bmx.svg",
    ),
]


def seed_db() -> None:
    """Заповнює БД тестовими даними, якщо вона порожня."""
    db = SessionLocal()
    try:
        admin_users = _parse_admin_users()

        # Завжди переконуємось, що адміністратори існують
        for admin in admin_users:
            if not get_user_by_username(db, admin["username"]):
                create_admin_user(
                    db,
                    UserCreate(
                        username=admin["username"],
                        email=admin["email"],
                        password=admin["password"],
                    ),
                )
                logger.info("Admin user created: %s", admin["username"])

        # Велосипеди сідуємо тільки якщо їх ще немає
        if get_bicycles(db, limit=1):
            return

        # Власником демо-велосипедів є перший адмін зі списку
        first_admin = admin_users[0]["username"] if admin_users else None
        owner = get_user_by_username(db, first_admin) if first_admin else None
        if not owner:
            logger.error(
                "No admin user found (ADMIN_CREDENTIALS may be empty or malformed). "
                "Demo bicycles will not be seeded."
            )
            return

        for bike_data in SEED_BIKES:
            create_bicycle(db, bike_data, owner_id=owner.id)

        db.commit()
        logger.info("Seed data: %d bicycles added.", len(SEED_BIKES))
    except Exception:
        db.rollback()
        logger.exception("Failed to seed database. App will continue without seed data.")
    finally:
        db.close()
