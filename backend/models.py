from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: str | None = None
    email: EmailStr
    password: str
    fav_team: str

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str


# Main model for MongoDB documents
class Article(BaseModel):
    id: int = Field(..., alias="_id")  # MongoDB uses "_id" for the primary key
    title: str
    sections: List[Dict[str, str]]  # A list of dictionaries with "heading" and "content" keys
    links: List[Dict[str, str]]  # A list of dictionaries with link description and URL
    conclusion: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True  # Allows using "_id" as "id" in input/output
        arbitrary_types_allowed = True  # MongoDB specific types like ObjectId are allowed