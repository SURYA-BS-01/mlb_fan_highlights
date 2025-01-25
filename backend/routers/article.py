from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from ..models import Article
from ..schemas import ArticleInOut
from .. import oauth
from ..database import get_db, collection
from pymongo.collection import Collection

router = APIRouter(
    prefix="/article",
    tags=["articles"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ArticleInOut)
async def create_task(new_article: ArticleInOut, current_user: int = Depends(oauth.get_current_user)):
    
    # Insert the article into the MongoDB collection
    resp = collection.insert_one(new_article.dict())

    # Return the inserted article with an added `id`
    return {
        **new_article.model_dump(),
        "_id": str(resp.inserted_id)  # Convert ObjectId to string for better readability
    }

@router.get("/article/{title}")
async def get_article(title: str):
    article = collection.find_one({"title": title})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article["_id"] = str(article["_id"])  # Convert ObjectId to string
    return article
