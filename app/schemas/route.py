from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


DIFFICULTY_VALUES = "^(easy|medium|hard|extreme)$"


class RouteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    map_url: Optional[str] = None
    length_km: Optional[float] = Field(None, gt=0)
    difficulty: str = Field("easy", pattern=DIFFICULTY_VALUES)


class RouteCreate(RouteBase):
    pass


class RouteUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    map_url: Optional[str] = None
    length_km: Optional[float] = Field(None, gt=0)
    difficulty: Optional[str] = Field(None, pattern=DIFFICULTY_VALUES)


class RouteResponse(RouteBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
