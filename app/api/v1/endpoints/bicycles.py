"""
Ендпоінти для велосипедів: CRUD операції
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.bicycle import (
    create_bicycle, delete_bicycle, get_bicycle, get_bicycles, update_bicycle
)
from app.database import get_db
from app.schemas.bicycle import BicycleCreate, BicycleResponse, BicycleUpdate

router = APIRouter()


@router.get("/", response_model=List[BicycleResponse], tags=["bicycles"])
async def list_bicycles(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = Query(None, pattern="^(mountain|city|road|bmx|electric)$", description="Filter by type: mountain/city/road/bmx/electric"),
    available_only: bool = Query(False, description="Show only available bicycles"),
    db: Session = Depends(get_db),
):
    """Список всіх велосипедів (публічний ендпоінт)"""
    return get_bicycles(db, skip=skip, limit=limit, type=type, available_only=available_only)


@router.post("/", response_model=BicycleResponse, status_code=status.HTTP_201_CREATED, tags=["bicycles"])
async def add_bicycle(
    bicycle_in: BicycleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Додавання нового велосипеда (тільки адміністратори)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can add bicycles")
    return create_bicycle(db, bicycle_in, owner_id=current_user.id)


@router.get("/{bicycle_id}", response_model=BicycleResponse, tags=["bicycles"])
async def get_bicycle_by_id(
    bicycle_id: int,
    db: Session = Depends(get_db),
):
    """Отримання велосипеда за ID (публічний ендпоінт)"""
    bicycle = get_bicycle(db, bicycle_id)
    if not bicycle:
        raise HTTPException(status_code=404, detail="Bicycle not found")
    return bicycle


@router.put("/{bicycle_id}", response_model=BicycleResponse, tags=["bicycles"])
async def update_bicycle_endpoint(
    bicycle_id: int,
    bicycle_update: BicycleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Оновлення велосипеда (тільки адміністратори)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can edit bicycles")
    bicycle = get_bicycle(db, bicycle_id)
    if not bicycle:
        raise HTTPException(status_code=404, detail="Bicycle not found")
    return update_bicycle(db, bicycle_id, bicycle_update)


@router.delete("/{bicycle_id}", response_model=BicycleResponse, tags=["bicycles"])
async def delete_bicycle_endpoint(
    bicycle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Видалення велосипеда (тільки адміністратори)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can delete bicycles")
    bicycle = get_bicycle(db, bicycle_id)
    if not bicycle:
        raise HTTPException(status_code=404, detail="Bicycle not found")
    return delete_bicycle(db, bicycle_id)
