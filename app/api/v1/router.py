"""
Головний роутер API v1
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, bicycles

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router, prefix="/users")
router.include_router(bicycles.router, prefix="/bicycles")
