"""
Pydantic схеми оренди велосипеда
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.bicycle import BicycleResponse


class RentalCreate(BaseModel):
    """Схема для створення оренди"""
    bicycle_id: int
    hours: float = Field(..., gt=0, le=720, description="Кількість годин (до 720)")
    payment_method: str = Field(
        ..., pattern="^(card|cash|apple_pay|google_pay)$",
        description="card / cash / apple_pay / google_pay",
    )


class RentalResponse(BaseModel):
    """Схема відповіді з даними оренди"""
    id: int
    user_id: int
    bicycle_id: int
    hours: float
    total_price: float
    payment_method: str
    status: str
    created_at: Optional[datetime] = None
    bicycle: Optional[BicycleResponse] = None

    model_config = {"from_attributes": True}
