"""CRUD для маршрутів — ВелоХаус"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.route import Route
from app.schemas.route import RouteCreate, RouteUpdate


def get_route(db: Session, route_id: int) -> Optional[Route]:
    return db.query(Route).filter(Route.id == route_id).first()


def get_routes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    difficulty: Optional[str] = None,
    max_length_km: Optional[float] = None,
) -> List[Route]:
    q = db.query(Route)
    if difficulty:
        q = q.filter(Route.difficulty == difficulty)
    if max_length_km is not None:
        q = q.filter(Route.length_km <= max_length_km)
    return q.order_by(Route.name).offset(skip).limit(limit).all()


def create_route(db: Session, route: RouteCreate) -> Route:
    obj = Route(**route.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_route(db: Session, route_id: int, data: RouteUpdate) -> Optional[Route]:
    obj = get_route(db, route_id)
    if not obj:
        return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_route(db: Session, route_id: int) -> Optional[Route]:
    obj = get_route(db, route_id)
    if not obj:
        return None
    db.delete(obj)
    db.commit()
    return obj
