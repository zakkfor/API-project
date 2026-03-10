"""
Ендпоінти запчастин — ВелоХаус
GET /spare-parts/          — публічний список (фільтри: category, manufacturer, search)
GET /spare-parts/{id}      — публічний
POST /spare-parts/         — адмін
PUT  /spare-parts/{id}     — адмін
DELETE /spare-parts/{id}   — адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.spare_part import (
    create_spare_part, delete_spare_part, get_spare_part, get_spare_parts, update_spare_part,
)
from app.database import get_db
from app.schemas.spare_part import SparePartCreate, SparePartResponse, SparePartUpdate

router = APIRouter(tags=["spare-parts"])


@router.get("/", response_model=List[SparePartResponse])
def list_spare_parts(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None, description="Фільтр по категорії"),
    manufacturer: Optional[str] = Query(None, description="Фільтр по виробнику"),
    search: Optional[str] = Query(None, description="Пошук по назві / артикулу"),
    db: Session = Depends(get_db),
):
    """Список запчастин (публічний)"""
    return get_spare_parts(
        db, skip=skip, limit=limit,
        category=category, manufacturer=manufacturer, search=search,
    )


@router.get("/{spare_part_id}", response_model=SparePartResponse)
def get_one_spare_part(spare_part_id: int, db: Session = Depends(get_db)):
    obj = get_spare_part(db, spare_part_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Запчастину не знайдено")
    return obj


@router.post("/", response_model=SparePartResponse, status_code=status.HTTP_201_CREATED)
def add_spare_part(
    body: SparePartCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    return create_spare_part(db, body)


@router.put("/{spare_part_id}", response_model=SparePartResponse)
def edit_spare_part(
    spare_part_id: int,
    body: SparePartUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = update_spare_part(db, spare_part_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Запчастину не знайдено")
    return obj


@router.delete("/{spare_part_id}", response_model=SparePartResponse)
def remove_spare_part(
    spare_part_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = delete_spare_part(db, spare_part_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Запчастину не знайдено")
    return obj
