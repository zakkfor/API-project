from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class ClientBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=30)
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    registration_place: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=30)
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    registration_place: Optional[str] = None


class ClientResponse(ClientBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
