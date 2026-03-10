from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AccessoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = None
    brand: Optional[str] = None
    country: Optional[str] = None
    warranty_months: Optional[int] = Field(None, ge=0)
    sale_price: float = Field(0.0, ge=0)
    quantity: int = Field(0, ge=0)


class AccessoryCreate(AccessoryBase):
    pass


class AccessoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    brand: Optional[str] = None
    country: Optional[str] = None
    warranty_months: Optional[int] = Field(None, ge=0)
    sale_price: Optional[float] = Field(None, ge=0)
    quantity: Optional[int] = Field(None, ge=0)


class AccessoryResponse(AccessoryBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
