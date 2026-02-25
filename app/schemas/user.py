"""
Pydantic схеми користувача
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Базова схема користувача"""
    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Схема для створення користувача"""
    password: str


class UserUpdate(BaseModel):
    """Схема для оновлення користувача"""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Схема відповіді з даними користувача"""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserInDB(UserResponse):
    """Схема користувача з хешованим паролем (внутрішня)"""
    hashed_password: str
