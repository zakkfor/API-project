"""
Ендпоінти ремонтів — ВелоХаус
GET /repairs/              — адмін (фільтри: bicycle_id, repair_type, performer)
GET /repairs/{id}          — адмін
POST /repairs/             — адмін (з прив'язкою запчастин)
PUT  /repairs/{id}         — адмін
DELETE /repairs/{id}       — адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.repair import (
    create_repair, delete_repair, get_repair, get_repairs, update_repair,
)
from app.database import get_db
from app.schemas.repair import RepairCreate, RepairResponse, RepairUpdate

router = APIRouter(tags=["repairs"])


def _require_admin(current_user):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")


@router.get("/", response_model=List[RepairResponse])
def list_repairs(
    skip: int = 0,
    limit: int = 100,
    bicycle_id: Optional[int] = Query(None, description="Фільтр по велосипеду"),
    repair_type: Optional[str] = Query(None, description="Тип ремонту"),
    performer: Optional[str] = Query(None, description="Виконавець"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Список ремонтів (адмін)"""
    _require_admin(current_user)
    return get_repairs(
        db, skip=skip, limit=limit,
        bicycle_id=bicycle_id, repair_type=repair_type, performer=performer,
    )


@router.get("/{repair_id}", response_model=RepairResponse)
def get_one_repair(
    repair_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = get_repair(db, repair_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ремонт не знайдено")
    return obj


@router.post("/", response_model=RepairResponse, status_code=status.HTTP_201_CREATED)
def add_repair(
    body: RepairCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    return create_repair(db, body)


@router.put("/{repair_id}", response_model=RepairResponse)
def edit_repair(
    repair_id: int,
    body: RepairUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = update_repair(db, repair_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Ремонт не знайдено")
    return obj


@router.delete("/{repair_id}", response_model=RepairResponse)
def remove_repair(
    repair_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = delete_repair(db, repair_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ремонт не знайдено")
    return obj
