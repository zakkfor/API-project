"""
CRUD операції для оренди велосипедів
"""
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.models.rental import Rental
from app.schemas.rental import RentalCreate


def create_rental(
    db: Session, rental_in: RentalCreate, user_id: int, price_per_hour: float
) -> Rental:
    """Створення нового запису оренди"""
    total_price = round(rental_in.hours * price_per_hour, 2)
    db_rental = Rental(
        user_id=user_id,
        bicycle_id=rental_in.bicycle_id,
        hours=rental_in.hours,
        total_price=total_price,
        payment_method=rental_in.payment_method,
    )
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental


def get_user_rentals(db: Session, user_id: int) -> List[Rental]:
    """Отримання всіх оренд поточного користувача (останні спочатку)"""
    return (
        db.query(Rental)
        .filter(Rental.user_id == user_id)
        .options(joinedload(Rental.bicycle))
        .order_by(Rental.created_at.desc())
        .all()
    )


def get_rental(db: Session, rental_id: int) -> Optional[Rental]:
    """Отримання конкретної оренди за ID"""
    return db.query(Rental).filter(Rental.id == rental_id).first()
