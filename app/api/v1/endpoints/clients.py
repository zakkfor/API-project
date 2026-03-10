"""
Ендпоінти клієнтів — ВелоХаус
GET /clients/              — тільки адмін (список з пошуком)
GET /clients/{id}          — тільки адмін
POST /clients/             — тільки адмін
PUT  /clients/{id}         — тільки адмін
DELETE /clients/{id}       — тільки адмін
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.client import (
    create_client, delete_client, get_client, get_clients, update_client,
)
from app.database import get_db
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate

router = APIRouter(tags=["clients"])


def _require_admin(current_user):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Тільки адміністратори")


@router.get("/", response_model=List[ClientResponse])
def list_clients(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Пошук по ПІБ / email / телефону"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Список клієнтів (адмін)"""
    _require_admin(current_user)
    return get_clients(db, skip=skip, limit=limit, search=search)


@router.get("/{client_id}", response_model=ClientResponse)
def get_one_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = get_client(db, client_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Клієнта не знайдено")
    return obj


@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def add_client(
    body: ClientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    return create_client(db, body)


@router.put("/{client_id}", response_model=ClientResponse)
def edit_client(
    client_id: int,
    body: ClientUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = update_client(db, client_id, body)
    if not obj:
        raise HTTPException(status_code=404, detail="Клієнта не знайдено")
    return obj


@router.delete("/{client_id}", response_model=ClientResponse)
def remove_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    _require_admin(current_user)
    obj = delete_client(db, client_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Клієнта не знайдено")
    return obj
