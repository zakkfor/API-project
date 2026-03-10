from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TariffBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    deposit: float = Field(0.0, ge=0)
    price_per_day: float = Field(..., gt=0)
    price_per_hour: float = Field(..., gt=0)
    rental_point: Optional[str] = None


class TariffCreate(TariffBase):
    pass


class TariffUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = None
    deposit: Optional[float] = Field(None, ge=0)
    price_per_day: Optional[float] = Field(None, gt=0)
    price_per_hour: Optional[float] = Field(None, gt=0)
    rental_point: Optional[str] = None


class TariffResponse(TariffBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
