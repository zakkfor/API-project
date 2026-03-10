from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.schemas.spare_part import SparePartResponse


class RepairBase(BaseModel):
    bicycle_id: int
    date: date
    repair_type: str = Field(..., min_length=1, max_length=200)
    performer: Optional[str] = None
    warranty_days: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None


class RepairCreate(RepairBase):
    spare_part_ids: Optional[List[int]] = []


class RepairUpdate(BaseModel):
    date: Optional[date] = None
    repair_type: Optional[str] = Field(None, min_length=1, max_length=200)
    performer: Optional[str] = None
    warranty_days: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None
    spare_part_ids: Optional[List[int]] = None


class RepairResponse(RepairBase):
    id: int
    created_at: Optional[datetime] = None
    spare_parts: List[SparePartResponse] = []
    model_config = {"from_attributes": True}
