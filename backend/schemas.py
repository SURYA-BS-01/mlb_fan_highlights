from pydantic import BaseModel, EmailStr, Field
    
from typing import Optional, Dict, List
from datetime import datetime
from bson import ObjectId

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fav_team: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str]

class ArticleIn(BaseModel):
    title: str
    sections: Optional[Dict[str, str]]  # Same as the Article model
    links: Optional[Dict[str, str]]  # Same as the Article model
    conclusion: str
    created_at: Optional[datetime] = Field(default=None)

class ArticlePost(BaseModel):
    title: str
    sections: List[Dict[str, str]]  # Same as the Article model
    links: List[Dict[str, str]]  # Same as the Article model
    conclusion: str
    created_at: Optional[datetime] = Field(default=None)
    game_date: str
    team_home: str
    team_away: str


class ArticleOut(BaseModel):
    _id: ObjectId
    title: str
    sections: List[Dict[str, str]]  # Same as the Article model
    links: List[Dict[str, str]]  # Same as the Article model
    conclusion: str
    game_date: str
    team_home: str
    team_away: str

class UserArticle(BaseModel):
    id: str
    article: ArticlePost