"""
Головний роутер API v1 — ВелоХаус
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth, users, bicycles, upload, rentals,
    tariffs, clients, routes, spare_parts, repairs, accessories, info,
)

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router, prefix="/users")
router.include_router(bicycles.router, prefix="/bicycles")
router.include_router(upload.router)
router.include_router(rentals.router, prefix="/rentals")
router.include_router(tariffs.router, prefix="/tariffs")
router.include_router(clients.router, prefix="/clients")
router.include_router(routes.router, prefix="/routes")
router.include_router(spare_parts.router, prefix="/spare-parts")
router.include_router(repairs.router, prefix="/repairs")
router.include_router(accessories.router, prefix="/accessories")
router.include_router(info.router)
