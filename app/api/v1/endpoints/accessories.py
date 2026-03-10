"""
Ендпоінти аксесуарів — ВелоХаус
GET /accessories/          — публічний список (фільтри: category, brand, country, search)
GET /accessories/{id}      — публічний
POST /accessories/         — адмін
PUT  /accessories/{id}     — адмін
DELETE /accessories/{id}   — адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.accessory import (
    create_accessory, delete_accessory, get_accessory, get_accessories, update_accessory,
)
from app.database import get_db
from app.schemas.accessory import AccessoryCreate, AccessoryResponse, AccessoryUpdate

router = APIRouter(tags=["accessories"])


@router.get("/", response_model=List[AccessoryResponse])
def list_accessories(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None, description="Фільтр по категорії"),
    brand: Optional[str] = Query(None, description="Фільтр по бренду"),
    country: Optional[str] = Query(None, description="Фільтр по країні виробника"),
    search: Optional[str] = Query(None, description="Пошук по назві"),
    db: Session = Depends(get_db),
):
    """Список аксесуарів (публічний)"""
    return get_accessories(
        db, skip=skip, limit=limit,
        category=category, brand=brand, country=country, search=search,
    )


@router.get("/{accessory_id}", response_model=AccessoryResponse)
def get_one_accessory(accessory_id: int, db: Session = Depends(get_db)):
    obj = get_accessory(db, accessory_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Аксесуар не знайдено")
    return obj


@router.post("/", response_model=AccessoryResponse, status_code=status.HTTP_201_CREATED)
def add_accessory(
    body: AccessoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    return create_accessory(db, body)


@router.put("/{accessory_id}", response_model=AccessoryResponse)
def edit_accessory(
    accessory_id: int,
    body: AccessoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = update_accessory(db, accessory_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Аксесуар не знайдено")
    return obj


@router.delete("/{accessory_id}", response_model=AccessoryResponse)
def remove_accessory(
    accessory_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = delete_accessory(db, accessory_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Аксесуар не знайдено")
    return obj
