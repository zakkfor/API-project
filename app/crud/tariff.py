"""CRUD для тарифів — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.tariff import Tariff
from app.schemas.tariff import TariffCreate, TariffUpdate


def get_tariff(db: Session, tariff_id: int) -> Optional[Tariff]:
    return db.query(Tariff).filter(Tariff.id == tariff_id).first()


def get_tariffs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    rental_point: Optional[str] = None,
) -> List[Tariff]:
    q = db.query(Tariff)
    if rental_point:
        q = q.filter(Tariff.rental_point.ilike(f"%{rental_point}%"))
    return q.order_by(Tariff.id).offset(skip).limit(limit).all()


def create_tariff(db: Session, tariff: TariffCreate) -> Tariff:
    obj = Tariff(**tariff.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_tariff(db: Session, tariff_id: int, data: TariffUpdate) -> Optional[Tariff]:
    obj = get_tariff(db, tariff_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_tariff(db: Session, tariff_id: int) -> Optional[Tariff]:
    obj = get_tariff(db, tariff_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
