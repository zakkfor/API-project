"""CRUD для ремонтів — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.repair import Repair
from app.models.spare_part import SparePart
from app.schemas.repair import RepairCreate, RepairUpdate


def _load_spare_parts(db: Session, ids: List[int]) -> List[SparePart]:
    return db.query(SparePart).filter(SparePart.id.in_(ids)).all()


def get_repair(db: Session, repair_id: int) -> Optional[Repair]:
    return (
        db.query(Repair)
        .options(joinedload(Repair.spare_parts))
        .filter(Repair.id == repair_id)
        .first()
    )


def get_repairs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    bicycle_id: Optional[int] = None,
    repair_type: Optional[str] = None,
    performer: Optional[str] = None,
) -> List[Repair]:
    q = db.query(Repair).options(joinedload(Repair.spare_parts))
    if bicycle_id is not None:
        q = q.filter(Repair.bicycle_id == bicycle_id)
    if repair_type:
        q = q.filter(Repair.repair_type.ilike(f"%{repair_type}%"))
    if performer:
        q = q.filter(Repair.performer.ilike(f"%{performer}%"))
    return q.order_by(Repair.date.desc()).offset(skip).limit(limit).all()


def create_repair(db: Session, repair: RepairCreate) -> Repair:
    spare_part_ids = repair.spare_part_ids or []
    data = repair.model_dump(exclude={"spare_part_ids"})
    obj = Repair(**data)
    if spare_part_ids:
        obj.spare_parts = _load_spare_parts(db, spare_part_ids)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return get_repair(db, obj.id)  # reload with eager-loaded spare_parts


def update_repair(db: Session, repair_id: int, data: RepairUpdate) -> Optional[Repair]:
    obj = get_repair(db, repair_id)
    if not obj:
        return None
    spare_part_ids = data.spare_part_ids
    for k, v in data.model_dump(exclude_unset=True, exclude={"spare_part_ids"}).items():
        setattr(obj, k, v)
    if spare_part_ids is not None:
        obj.spare_parts = _load_spare_parts(db, spare_part_ids)
    db.commit()
    db.refresh(obj)
    return get_repair(db, obj.id)


def delete_repair(db: Session, repair_id: int) -> Optional[Repair]:
    obj = db.query(Repair).filter(Repair.id == repair_id).first()
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
