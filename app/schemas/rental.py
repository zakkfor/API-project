from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.bicycle import BicycleResponse

class RentalCreate(BaseModel):
    bicycle_id: int
    hours: float = Field(..., gt=0, le=720, description="Кількість годин (до 720)")
    payment_method: str = Field(
        ..., pattern="^(card|cash|apple_pay|google_pay)$",
        description="card / cash / apple_pay / google_pay",
    )
    tariff_id: Optional[int] = None
    client_id: Optional[int] = None
    route_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class RentalResponse(BaseModel):
    id: int
    user_id: int
    bicycle_id: int
    tariff_id: Optional[int] = None
    client_id: Optional[int] = None
    route_id: Optional[int] = None
    hours: float
    total_price: float
    payment_method: str
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: Optional[datetime] = None
    bicycle: Optional[BicycleResponse] = None
    model_config = {"from_attributes": True}
