"""
Ендпоінти маршрутів — ВелоХаус
GET /routes/               — публічний список (фільтри: difficulty, max_length_km)
GET /routes/{id}           — публічний
POST /routes/              — адмін
PUT  /routes/{id}          — адмін
DELETE /routes/{id}        — адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.route import (
    create_route, delete_route, get_route, get_routes, update_route,
)
from app.database import get_db
from app.schemas.route import RouteCreate, RouteResponse, RouteUpdate

router = APIRouter(tags=["routes"])


@router.get("/", response_model=List[RouteResponse])
def list_routes(
    skip: int = 0,
    limit: int = 100,
    difficulty: Optional[str] = Query(
        None,
        pattern="^(easy|medium|hard|extreme)$",
        description="easy / medium / hard / extreme",
    ),
    max_length_km: Optional[float] = Query(None, gt=0, description="Максимальна довжина маршруту (км)"),
    db: Session = Depends(get_db),
):
    """Список маршрутів (публічний)"""
    return get_routes(db, skip=skip, limit=limit, difficulty=difficulty, max_length_km=max_length_km)


@router.get("/{route_id}", response_model=RouteResponse)
def get_one_route(route_id: int, db: Session = Depends(get_db)):
    obj = get_route(db, route_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Маршрут не знайдено")
    return obj


@router.post("/", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
def add_route(
    body: RouteCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    return create_route(db, body)


@router.put("/{route_id}", response_model=RouteResponse)
def edit_route(
    route_id: int,
    body: RouteUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = update_route(db, route_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Маршрут не знайдено")
    return obj


@router.delete("/{route_id}", response_model=RouteResponse)
def remove_route(
    route_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = delete_route(db, route_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Маршрут не знайдено")
    return obj
