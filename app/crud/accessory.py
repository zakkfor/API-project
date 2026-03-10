"""CRUD для аксесуарів — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.accessory import Accessory
from app.schemas.accessory import AccessoryCreate, AccessoryUpdate


def get_accessory(db: Session, accessory_id: int) -> Optional[Accessory]:
    return db.query(Accessory).filter(Accessory.id == accessory_id).first()


def get_accessories(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Accessory]:
    q = db.query(Accessory)
    if category:
        q = q.filter(Accessory.category.ilike(f"%{category}%"))
    if brand:
        q = q.filter(Accessory.brand.ilike(f"%{brand}%"))
    if country:
        q = q.filter(Accessory.country.ilike(f"%{country}%"))
    if search:
        q = q.filter(Accessory.name.ilike(f"%{search}%"))
    return q.order_by(Accessory.name).offset(skip).limit(limit).all()


def create_accessory(db: Session, accessory: AccessoryCreate) -> Accessory:
    obj = Accessory(**accessory.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_accessory(
    db: Session, accessory_id: int, data: AccessoryUpdate
) -> Optional[Accessory]:
    obj = get_accessory(db, accessory_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_accessory(db: Session, accessory_id: int) -> Optional[Accessory]:
    obj = get_accessory(db, accessory_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
