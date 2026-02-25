"""
Pydantic схеми токенів
"""
from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    """Схема відповіді з токеном"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Схема даних всередині токена"""
    username: Optional[str] = None
