"""CRUD для запчастин — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.spare_part import SparePart
from app.schemas.spare_part import SparePartCreate, SparePartUpdate


def get_spare_part(db: Session, spare_part_id: int) -> Optional[SparePart]:
    return db.query(SparePart).filter(SparePart.id == spare_part_id).first()


def get_spare_parts(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    manufacturer: Optional[str] = None,
    search: Optional[str] = None,
) -> List[SparePart]:
    q = db.query(SparePart)
    if category:
        q = q.filter(SparePart.category.ilike(f"%{category}%"))
    if manufacturer:
        q = q.filter(SparePart.manufacturer.ilike(f"%{manufacturer}%"))
    if search:
        term = f"%{search}%"
        q = q.filter(
            SparePart.name.ilike(term) | SparePart.article.ilike(term)
        )
    return q.order_by(SparePart.name).offset(skip).limit(limit).all()


def create_spare_part(db: Session, spare_part: SparePartCreate) -> SparePart:
    obj = SparePart(**spare_part.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_spare_part(
    db: Session, spare_part_id: int, data: SparePartUpdate
) -> Optional[SparePart]:
    obj = get_spare_part(db, spare_part_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_spare_part(db: Session, spare_part_id: int) -> Optional[SparePart]:
    obj = get_spare_part(db, spare_part_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
