"""
Ендпоінти тарифів — ВелоХаус
GET /tariffs/              — публічний список з фільтром по rental_point
GET /tariffs/{id}          — публічний детальний перегляд
POST /tariffs/             — тільки адмін
PUT  /tariffs/{id}         — тільки адмін
DELETE /tariffs/{id}       — тільки адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.tariff import (
    create_tariff, delete_tariff, get_tariff, get_tariffs, update_tariff,
)
from app.database import get_db
from app.schemas.tariff import TariffCreate, TariffResponse, TariffUpdate

router = APIRouter(tags=["tariffs"])


@router.get("/", response_model=List[TariffResponse])
def list_tariffs(
    skip: int = 0,
    limit: int = 100,
    rental_point: Optional[str] = Query(None, description="Фільтр по точці прокату"),
    db: Session = Depends(get_db),
):
    """Список тарифів (публічний)"""
    return get_tariffs(db, skip=skip, limit=limit, rental_point=rental_point)


@router.get("/{tariff_id}", response_model=TariffResponse)
def get_one_tariff(tariff_id: int, db: Session = Depends(get_db)):
    obj = get_tariff(db, tariff_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Тариф не знайдено")
    return obj


@router.post("/", response_model=TariffResponse, status_code=status.HTTP_201_CREATED)
def add_tariff(
    body: TariffCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    return create_tariff(db, body)


@router.put("/{tariff_id}", response_model=TariffResponse)
def edit_tariff(
    tariff_id: int,
    body: TariffUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = update_tariff(db, tariff_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Тариф не знайдено")
    return obj


@router.delete("/{tariff_id}", response_model=TariffResponse)
def remove_tariff(
    tariff_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")
    obj = delete_tariff(db, tariff_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Тариф не знайдено")
    return obj
