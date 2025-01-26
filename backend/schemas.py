from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, Dict, List
from datetime import datetime
from bson import ObjectId

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

class ArticleIn(BaseModel):
    title: str
    sections: Optional[Dict[str, str]]  # Same as the Article model
    links: Optional[Dict[str, str]]  # Same as the Article model
    conclusion: str

class ArticleOut(BaseModel):
    _id: ObjectId
    title: str
    sections: List[Dict[str, str]]  # Same as the Article model
    links: List[Dict[str, str]]  # Same as the Article model
    conclusion: str
