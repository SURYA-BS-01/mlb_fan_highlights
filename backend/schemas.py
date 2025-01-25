from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fav_team: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    created_at: datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int]

class ArticleInOut(BaseModel):
    title: str
    sections: List[Dict[str, str]]  # Same as the Article model
    links: List[Dict[str, str]]  # Same as the Article model
    conclusion: str
