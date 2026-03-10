"""
Початкове заповнення бази даних демонстраційними даними ВелоХаус.
Викликається при старті додатку; нічого не робить, якщо дані вже є.
"""
import logging
from datetime import date

from app.config import settings
from app.database import SessionLocal
from app.crud.user import get_user_by_username, create_user, create_admin_user
from app.crud.bicycle import get_bicycles, create_bicycle
from app.crud.tariff import get_tariffs, create_tariff
from app.crud.client import get_clients, create_client
from app.crud.route import get_routes, create_route
from app.crud.spare_part import get_spare_parts, create_spare_part
from app.crud.accessory import get_accessories, create_accessory
from app.crud.repair import create_repair
from app.schemas.user import UserCreate
from app.schemas.bicycle import BicycleCreate
from app.schemas.tariff import TariffCreate
from app.schemas.client import ClientCreate
from app.schemas.route import RouteCreate
from app.schemas.spare_part import SparePartCreate
from app.schemas.accessory import AccessoryCreate
from app.schemas.repair import RepairCreate

logger = logging.getLogger(__name__)


def _parse_admin_users() -> list[dict]:
    admins = []
    for entry in settings.ADMIN_CREDENTIALS.split(","):
        entry = entry.strip()
        if ":" not in entry:
            logger.warning("Skipping malformed ADMIN_CREDENTIALS entry: %r", entry)
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
    BicycleCreate(name="Trek Marlin 7", brand="Trek", model="Marlin 7", type="mountain",
                  year=2023, color="Синій", price_per_hour=85.0,
                  description="Надійний гірський велосипед для трейлів. Алюмінієва рама, 29\", гідравлічні гальма.",
                  is_available=True, image_url="/static/bikes/mountain.svg"),
    BicycleCreate(name="Giant Escape 3", brand="Giant", model="Escape 3", type="city",
                  year=2022, color="Чорний", price_per_hour=55.0,
                  description="Легкий міський гібрид для щоденних поїздок.",
                  is_available=True, image_url="/static/bikes/city.svg"),
    BicycleCreate(name="Specialized Allez", brand="Specialized", model="Allez Sport", type="road",
                  year=2023, color="Червоний", price_per_hour=120.0,
                  description="Класичне шосейне шасі. Shimano Claris 16 швидкостей.",
                  is_available=True, image_url="/static/bikes/road.svg"),
    BicycleCreate(name="Mongoose Title Pro", brand="Mongoose", model="Title Pro", type="bmx",
                  year=2021, color="Білий", price_per_hour=40.0,
                  description="Профі BMX для скейт-парків та вуличних трюків.",
                  is_available=True, image_url="/static/bikes/bmx.svg"),
    BicycleCreate(name="Cannondale Quick Neo", brand="Cannondale", model="Quick Neo SL 2", type="electric",
                  year=2024, color="Зелений", price_per_hour=150.0,
                  description="Швидкий e-байк. Запас ходу до 100 км.",
                  is_available=True, image_url="/static/bikes/electric.svg"),
    BicycleCreate(name="Scott Aspect 950", brand="Scott", model="Aspect 950", type="mountain",
                  year=2022, color="Сірий", price_per_hour=70.0,
                  description="Гірський велосипед для початківців. 27,5\".",
                  is_available=True, image_url="/static/bikes/mountain.svg"),
    BicycleCreate(name="Merida Crossway 100", brand="Merida", model="Crossway 100", type="city",
                  year=2021, color="Фіолетовий", price_per_hour=50.0,
                  description="Кросовий велосипед для асфальту та ґрунту.",
                  is_available=False, image_url="/static/bikes/city.svg"),
    BicycleCreate(name="Trek Émonda ALR 5", brand="Trek", model="Émonda ALR 5", type="road",
                  year=2023, color="Жовтий", price_per_hour=140.0,
                  description="Легке шосейне рішення. Shimano 105.",
                  is_available=True, image_url="/static/bikes/road.svg"),
    BicycleCreate(name="Haibike AllMtn 3", brand="Haibike", model="AllMtn 3", type="electric",
                  year=2024, color="Помаранчевий", price_per_hour=175.0,
                  description="Електричний гірський байк. Мотор Yamaha PW-X3.",
                  is_available=True, image_url="/static/bikes/electric.svg"),
    BicycleCreate(name="Colony Premise", brand="Colony", model="Premise", type="bmx",
                  year=2022, color="Чорний", price_per_hour=35.0,
                  description="Street BMX для фрістайлу.",
                  is_available=True, image_url="/static/bikes/bmx.svg"),
    BicycleCreate(name="Trek Checkpoint ALR 5", brand="Trek", model="Checkpoint ALR 5", type="gravel",
                  year=2023, color="Бежевий", price_per_hour=110.0,
                  description="Гравел-велосипед. Shimano GRX 11 ск.",
                  is_available=True, image_url="/static/bikes/road.svg"),
]

SEED_TARIFFS: list[TariffCreate] = [
    TariffCreate(name="Базовий", description="Стандартний тариф для прокату",
                 deposit=500.0, price_per_day=350.0, price_per_hour=55.0,
                 rental_point="Центральний парк, вхід №1"),
    TariffCreate(name="Преміум", description="Преміум-тариф з електровелосипедами",
                 deposit=1500.0, price_per_day=900.0, price_per_hour=150.0,
                 rental_point="Набережна, стійка А"),
    TariffCreate(name="Студентський", description="Знижений тариф для студентів",
                 deposit=300.0, price_per_day=200.0, price_per_hour=35.0,
                 rental_point="Університетська площа"),
    TariffCreate(name="Сімейний", description="Тариф для оренди кількох велосипедів",
                 deposit=800.0, price_per_day=600.0, price_per_hour=90.0,
                 rental_point="Центральний парк, вхід №2"),
]

SEED_CLIENTS: list[ClientCreate] = [
    ClientCreate(full_name="Коваленко Олексій Іванович", phone="+380501234567",
                 email="kovalenko@example.com", birth_date=date(1990, 5, 15),
                 registration_place="м. Київ, вул. Хрещатик, 1"),
    ClientCreate(full_name="Петренко Марія Василівна", phone="+380671234567",
                 email="petrenko@example.com", birth_date=date(1995, 8, 22),
                 registration_place="м. Київ, вул. Сагайдачного, 14"),
    ClientCreate(full_name="Шевченко Дмитро Олегович", phone="+380631234567",
                 email="shevchenko@example.com", birth_date=date(1988, 12, 3),
                 registration_place="м. Львів, пр. Свободи, 5"),
    ClientCreate(full_name="Бойко Наталія Петрівна", phone="+380991234567",
                 email="boyko@example.com", birth_date=date(2000, 3, 10),
                 registration_place="м. Харків, вул. Сумська, 25"),
    ClientCreate(full_name="Мельник Андрій Сергійович", phone="+380731234567",
                 email="melnyk@example.com", birth_date=date(1985, 7, 18),
                 registration_place="м. Одеса, вул. Дерибасівська, 3"),
]

SEED_ROUTES: list[RouteCreate] = [
    RouteCreate(name="Парковий маршрут", difficulty="easy", length_km=5.2,
                description="Прогулянка центральним парком. Рівна асфальтована доріжка.",
                map_url=None),
    RouteCreate(name="Набережна — міст", difficulty="easy", length_km=12.0,
                description="Від набережної до пішохідного мосту та назад.",
                map_url=None),
    RouteCreate(name="Лісопарк", difficulty="medium", length_km=18.5,
                description="Через лісовий масив. Частково ґрунтова дорога.",
                map_url=None),
    RouteCreate(name="Гірський перевал", difficulty="hard", length_km=35.0,
                description="Складний маршрут зі значним перепадом висот.",
                map_url=None),
    RouteCreate(name="Екстремальний трейл", difficulty="extreme", length_km=22.0,
                description="Для досвідчених райдерів. Круті спуски та технічні секції.",
                map_url=None),
]

SEED_SPARE_PARTS: list[SparePartCreate] = [
    SparePartCreate(name="Гальмівна колодка Shimano", article="BR-M315-L",
                    manufacturer="Shimano", material="Органіка", category="Гальма",
                    purchase_price=120.0, quantity=50),
    SparePartCreate(name="Ланцюг KMC X11", article="X11-116L",
                    manufacturer="KMC", material="Сталь", category="Трансмісія",
                    purchase_price=280.0, quantity=30),
    SparePartCreate(name="Покришка Maxxis Ardent 29\"", article="TB96803000",
                    manufacturer="Maxxis", material="Гума", category="Колеса",
                    purchase_price=650.0, quantity=20),
    SparePartCreate(name="Каретка Shimano BB-MT500", article="BB-MT500-PA",
                    manufacturer="Shimano", material="Алюміній", category="Трансмісія",
                    purchase_price=450.0, quantity=15),
    SparePartCreate(name="Спиця DT Swiss 2.0mm", article="SPKL0270S0",
                    manufacturer="DT Swiss", material="Нержавіюча сталь", category="Колеса",
                    purchase_price=15.0, quantity=200),
    SparePartCreate(name="Рукоятка ODI Rogue", article="D30ROE",
                    manufacturer="ODI", material="Гума/алюміній", category="Кермо",
                    purchase_price=180.0, quantity=40),
]

SEED_ACCESSORIES: list[AccessoryCreate] = [
    AccessoryCreate(name="Шолом Uvex Race 7", category="Захист", brand="Uvex",
                    country="Німеччина", warranty_months=24, sale_price=1200.0, quantity=25),
    AccessoryCreate(name="Велозамок Kryptonite Evolution", category="Безпека", brand="Kryptonite",
                    country="США", warranty_months=12, sale_price=650.0, quantity=30),
    AccessoryCreate(name="Рюкзак-гідратор CamelBak", category="Сумки", brand="CamelBak",
                    country="США", warranty_months=12, sale_price=890.0, quantity=20),
    AccessoryCreate(name="Велокомп'ютер Garmin Edge 130", category="Електроніка", brand="Garmin",
                    country="США", warranty_months=12, sale_price=2800.0, quantity=15),
    AccessoryCreate(name="Рукавиці Fox Ranger", category="Одяг", brand="Fox",
                    country="США", warranty_months=6, sale_price=380.0, quantity=35),
    AccessoryCreate(name="Фара Moon Meteor Storm", category="Освітлення", brand="Moon",
                    country="Тайвань", warranty_months=12, sale_price=560.0, quantity=40),
]


def seed_db() -> None:
    """Заповнює БД тестовими даними, якщо вона порожня."""
    db = SessionLocal()
    try:
        admin_users = _parse_admin_users()

        # Адміністратори
        for admin in admin_users:
            if not get_user_by_username(db, admin["username"]):
                create_admin_user(
                    db,
                    UserCreate(username=admin["username"], email=admin["email"],
                               password=admin["password"]),
                )
                logger.info("Admin user created: %s", admin["username"])

        # Велосипеди — тільки якщо їх ще немає
        if not get_bicycles(db, limit=1):
            first_admin = admin_users[0]["username"] if admin_users else None
            owner = get_user_by_username(db, first_admin) if first_admin else None
            if owner:
                for bike_data in SEED_BIKES:
                    create_bicycle(db, bike_data, owner_id=owner.id)
                db.commit()
                logger.info("Seed: %d bicycles added.", len(SEED_BIKES))

        # Тарифи
        if not get_tariffs(db, limit=1):
            for t in SEED_TARIFFS:
                create_tariff(db, t)
            db.commit()
            logger.info("Seed: %d tariffs added.", len(SEED_TARIFFS))

        # Клієнти
        if not get_clients(db, limit=1):
            for c in SEED_CLIENTS:
                create_client(db, c)
            db.commit()
            logger.info("Seed: %d clients added.", len(SEED_CLIENTS))

        # Маршрути
        if not get_routes(db, limit=1):
            for r in SEED_ROUTES:
                create_route(db, r)
            db.commit()
            logger.info("Seed: %d routes added.", len(SEED_ROUTES))

        # Запчастини
        if not get_spare_parts(db, limit=1):
            for sp in SEED_SPARE_PARTS:
                create_spare_part(db, sp)
            db.commit()
            logger.info("Seed: %d spare parts added.", len(SEED_SPARE_PARTS))

        # Аксесуари
        if not get_accessories(db, limit=1):
            for acc in SEED_ACCESSORIES:
                create_accessory(db, acc)
            db.commit()
            logger.info("Seed: %d accessories added.", len(SEED_ACCESSORIES))

        # Ремонти (створюємо після велосипедів та запчастин)
        from app.models.repair import Repair as RepairModel
        if not db.query(RepairModel).first():
            from app.crud.bicycle import get_bicycles as gb
            from app.crud.spare_part import get_spare_parts as gsp
            bikes = gb(db, limit=3)
            parts = gsp(db, limit=3)
            if bikes and parts:
                create_repair(db, RepairCreate(
                    bicycle_id=bikes[0].id, date=date(2024, 3, 10),
                    repair_type="ТО (технічне обслуговування)", performer="Іваненко О.В.",
                    warranty_days=30, notes="Замінено ланцюг та гальмівні колодки.",
                    spare_part_ids=[p.id for p in parts[:2]],
                ))
                if len(bikes) >= 2:
                    create_repair(db, RepairCreate(
                        bicycle_id=bikes[1].id, date=date(2024, 4, 5),
                        repair_type="Ремонт проколу", performer="Коваль М.Д.",
                        warranty_days=7, notes="Замінено камеру переднього колеса.",
                        spare_part_ids=[],
                    ))
                if len(bikes) >= 3:
                    create_repair(db, RepairCreate(
                        bicycle_id=bikes[2].id, date=date(2024, 5, 20),
                        repair_type="Регулювання перемикачів", performer="Іваненко О.В.",
                        warranty_days=14, notes="Відрегульовано передній та задній перемикач.",
                        spare_part_ids=[parts[-1].id] if parts else [],
                    ))
                db.commit()
                logger.info("Seed: repairs added.")
    except Exception:
        db.rollback()
        logger.exception("Failed to seed database. App will continue without seed data.")
    finally:
        db.close()

