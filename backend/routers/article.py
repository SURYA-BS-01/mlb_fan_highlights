from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import ArticleIn, ArticleOut
from .. import oauth
from ..database import collection
from bson import ObjectId
from typing import List, Dict
from fastapi.responses import JSONResponse
from datetime import datetime


router = APIRouter(
    prefix="/article",
    tags=["articles"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ArticleOut)
async def create_task(new_article: ArticleIn, current_user: int = Depends(oauth.get_current_user)):
    
    # Insert the article into the MongoDB collection
    new_article = {**new_article, "created_at": datetime.now(datetime.timezone.utc)}
    resp = collection.insert_one(new_article)
    # Return the inserted article with an added `id`
    return {
        **new_article.model_dump(),
        "_id": str(resp.inserted_id)  # Convert ObjectId to string for better readability
    }

@router.get("/", response_model=List[Dict])
async def get_all_articles(current_user: int = Depends(oauth.get_current_user)):
    articles = collection.find()
    articles = [{**article, "_id": str(article["_id"])} for article in articles]
    return JSONResponse(content=articles)   

from pymongo import DESCENDING

@router.get("/latest", response_model=List[Dict])
async def get_all_articles(current_user: int = Depends(oauth.get_current_user)):
    # Fetch the last 5 articles sorted by creation time in descending order
    # articles = collection.find().sort("created_at").limit(5)
    articles = list(collection.find().sort("_id", DESCENDING).limit(5))
    # Convert ObjectId to string for JSON serialization
    articles = [{**article, "_id": str(article["_id"])} for article in articles]
    return JSONResponse(content=articles)



@router.get("/{id}", response_model=ArticleOut)
async def get_article(id: str, current_user: int = Depends(oauth.get_current_user)):
    try:
        # Ensure the ID is valid
        article = collection.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid article ID")

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Convert the ObjectId to a string
    article['_id'] = str(article['_id'])
    return article  # Return dict directly instead of JSONResponse
