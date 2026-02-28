"""
Ендпоінти оренди велосипедів
"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user
from app.crud.bicycle import get_bicycle
from app.crud.rental import create_rental, get_user_rentals
from app.database import get_db
from app.schemas.rental import RentalCreate, RentalResponse

router = APIRouter()


@router.post("/", response_model=RentalResponse, status_code=status.HTTP_201_CREATED, tags=["rentals"])
async def rent_bicycle(
    rental_in: RentalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Орендувати велосипед (будь-який авторизований користувач)"""
    bicycle = get_bicycle(db, rental_in.bicycle_id)
    if not bicycle:
        raise HTTPException(status_code=404, detail="Bicycle not found")
    if not bicycle.is_available:
        raise HTTPException(status_code=400, detail="Bicycle is not available for rent")
    return create_rental(db, rental_in, user_id=current_user.id, price_per_hour=bicycle.price_per_hour)


@router.get("/my", response_model=List[RentalResponse], tags=["rentals"])
async def my_rentals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Мої оренди (поточний користувач)"""
    return get_user_rentals(db, user_id=current_user.id)
