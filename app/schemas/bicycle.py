from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class BicycleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    brand: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(mountain|city|road|bmx|electric|gravel)$")
    year: Optional[int] = Field(None, ge=1900, le=2100, description="Рік випуску")
    color: Optional[str] = Field(None, max_length=60, description="Колір")
    price_per_hour: float = Field(..., gt=0)
    description: Optional[str] = None
    is_available: bool = True
    image_url: Optional[str] = None

class BicycleCreate(BicycleBase):
    pass

class BicycleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = Field(None, pattern="^(mountain|city|road|bmx|electric|gravel)$")
    year: Optional[int] = Field(None, ge=1900, le=2100)
    color: Optional[str] = Field(None, max_length=60)
    price_per_hour: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None

class BicycleResponse(BicycleBase):
    id: int
    owner_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
