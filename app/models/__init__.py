# Import order matters: bicycle_accessories Table is defined in accessory.py,
# so Accessory must be imported before Bicycle.
from app.models.user import User           # noqa: F401
from app.models.tariff import Tariff       # noqa: F401
from app.models.client import Client       # noqa: F401
from app.models.route import Route         # noqa: F401
from app.models.spare_part import SparePart  # noqa: F401
# repair_spare_parts Table is defined in repair.py — import after SparePart
from app.models.repair import Repair       # noqa: F401
# bicycle_accessories Table is defined in accessory.py — Bicycle must be imported after
from app.models.accessory import Accessory  # noqa: F401
from app.models.bicycle import Bicycle     # noqa: F401
from app.models.rental import Rental       # noqa: F401

__all__ = [
    "User", "Tariff", "Client", "Route",
    "SparePart", "Repair", "Accessory",
    "Bicycle", "Rental",
]
