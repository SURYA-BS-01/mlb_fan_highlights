from .database import Base
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    fav_team = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))




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
