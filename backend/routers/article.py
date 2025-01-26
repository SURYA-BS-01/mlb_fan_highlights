from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from ..models import Article
from ..schemas import ArticleIn, ArticleOut
from .. import oauth
from ..database import get_db, collection
from pymongo.collection import Collection
from bson import ObjectId
from typing import List, Dict
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/article",
    tags=["articles"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ArticleOut)
async def create_task(new_article: ArticleIn, current_user: int = Depends(oauth.get_current_user)):
    
    # Insert the article into the MongoDB collection
    resp = collection.insert_one(new_article.dict())
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
    print(article)
    article['_id'] = str(article['_id'])
    return article  # Return dict directly instead of JSONResponse
