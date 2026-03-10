from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SparePartBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    article: Optional[str] = Field(None, max_length=80)
    manufacturer: Optional[str] = None
    material: Optional[str] = None
    category: Optional[str] = None
    purchase_price: float = Field(0.0, ge=0)
    quantity: int = Field(0, ge=0)


class SparePartCreate(SparePartBase):
    pass


class SparePartUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    article: Optional[str] = Field(None, max_length=80)
    manufacturer: Optional[str] = None
    material: Optional[str] = None
    category: Optional[str] = None
    purchase_price: Optional[float] = Field(None, ge=0)
    quantity: Optional[int] = Field(None, ge=0)


class SparePartResponse(SparePartBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
