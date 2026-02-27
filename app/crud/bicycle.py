"""
CRUD операції для велосипедів
"""
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.bicycle import Bicycle
from app.schemas.bicycle import BicycleCreate, BicycleUpdate


def get_bicycle(db: Session, bicycle_id: int) -> Optional[Bicycle]:
    """Отримання велосипеда за ID"""
    return db.query(Bicycle).filter(Bicycle.id == bicycle_id).first()


def get_bicycles(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    available_only: bool = False,
) -> List[Bicycle]:
    """Отримання списку велосипедів з фільтрами"""
    query = db.query(Bicycle)
    if type:
        query = query.filter(Bicycle.type == type)
    if available_only:
        query = query.filter(Bicycle.is_available == True)  # noqa: E712
    return query.offset(skip).limit(limit).all()


def create_bicycle(db: Session, bicycle: BicycleCreate, owner_id: Optional[int] = None) -> Bicycle:
    """Створення нового велосипеда"""
    db_bicycle = Bicycle(**bicycle.model_dump(), owner_id=owner_id)
    db.add(db_bicycle)
    db.commit()
    db.refresh(db_bicycle)
    return db_bicycle


def update_bicycle(
    db: Session, bicycle_id: int, bicycle_update: BicycleUpdate
) -> Optional[Bicycle]:
    """Оновлення даних велосипеда"""
    db_bicycle = get_bicycle(db, bicycle_id)
    if not db_bicycle:
        return None
    for field, value in bicycle_update.model_dump(exclude_unset=True).items():
        setattr(db_bicycle, field, value)
    db.commit()
    db.refresh(db_bicycle)
    return db_bicycle


def delete_bicycle(db: Session, bicycle_id: int) -> Optional[Bicycle]:
    """Видалення велосипеда"""
    db_bicycle = get_bicycle(db, bicycle_id)
    if not db_bicycle:
        return None
    db.delete(db_bicycle)
    db.commit()
    return db_bicycle
