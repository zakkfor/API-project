"""CRUD для клієнтів — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate


def get_client(db: Session, client_id: int) -> Optional[Client]:
    return db.query(Client).filter(Client.id == client_id).first()


def get_clients(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
) -> List[Client]:
    q = db.query(Client)
    if search:
        term = f"%{search}%"
        q = q.filter(
            (Client.full_name.ilike(term))
            | (Client.email.ilike(term))
            | (Client.phone.ilike(term))
        )
    return q.order_by(Client.full_name).offset(skip).limit(limit).all()


def create_client(db: Session, client: ClientCreate) -> Client:
    obj = Client(**client.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_client(db: Session, client_id: int, data: ClientUpdate) -> Optional[Client]:
    obj = get_client(db, client_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_client(db: Session, client_id: int) -> Optional[Client]:
    obj = get_client(db, client_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
