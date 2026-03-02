from typing import Optional
from pydantic import BaseModel

class token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
