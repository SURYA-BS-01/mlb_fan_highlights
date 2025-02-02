from fastapi import APIRouter, HTTPException, status, Depends, Query
from ..schemas import ArticleOut, ArticlePost
from .. import oauth
from ..database import collection, get_db
from bson import ObjectId
from typing import List, Dict
from fastapi.responses import JSONResponse
from datetime import datetime 
from typing import Optional


router = APIRouter(
    prefix="/article",
    tags=["articles"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Dict)
async def create_task(new_article: ArticlePost, current_user: int = Depends(oauth.get_current_user)):
    
    # Insert the article into the MongoDB collection
    new_article.game_date = datetime.strptime(new_article.game_date, "%Y-%m-%d").isoformat()
    new_article.created_at = datetime.utcnow()
    db = get_db()
    article_data = {"id": current_user["id"], **new_article.model_dump()}
    resp = db.user_articles.insert_one(article_data)

    return {
        **new_article.model_dump(),
        "_id": str(resp.inserted_id)  # Convert ObjectId to string for better readability
    }

@router.get("/", response_model=List[Dict])
async def get_all_articles(current_user: int = Depends(oauth.get_current_user)):
    articles = collection.find()
    articles = [
        {key: value for key, value in article.items() if key not in ("created_at", "game_date")}
        | {"_id": str(article["_id"])}
        for article in articles
    ]
    return JSONResponse(content=articles)   

from pymongo import DESCENDING

@router.get("/latest", response_model=List[Dict])
async def get_all_articles(current_user: int = Depends(oauth.get_current_user)):
    # Fetch the last 5 articles sorted by creation time in descending order
    print(current_user)
    articles = list(collection.find().sort("_id", DESCENDING).limit(5))

    articles = [
        {key: value for key, value in article.items() if key not in ("created_at")}
        | {"_id": str(article["_id"])}
        for article in articles
    ]

    return articles

@router.get("/user_articles", response_model=List[Dict])
async def get_user_articles(current_user: int = Depends(oauth.get_current_user)):
    # Fetch the last 5 articles sorted by creation time in descending order
    db = get_db()
    articles = list(db.user_articles.find())
    articles = [
        {key: value for key, value in article.items() if key not in ("created_at", "id")}
        | {"_id": str(article["_id"])}
        for article in articles
    ]
    return articles

@router.get("/filter", response_model=List[Dict]) 
async def get_filtered_articles(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    team: Optional[str] = Query(None),
    current_user: int = Depends(oauth.get_current_user)
):
    query = {}

    # Keep `game_date` as string for filtering
    if start_date:
        query.setdefault("game_date", {})["$gte"] = start_date
    if end_date:
        query.setdefault("game_date", {})["$lte"] = end_date

    # Case-insensitive substring match for both `team_home` and `team_away`
    if team:
        regex_filter = {"$regex": team, "$options": "i"}
        query["$or"] = [
            {"team_home": regex_filter},
            {"team_away": regex_filter}
        ]

    print("MongoDB Query:", query)  # Debugging line

    articles = list(collection.find(query))
    for article in articles:
        article["_id"] = str(article["_id"])
    
    print(articles)  # Debugging line

    return articles


@router.get("/{id}", response_model=ArticleOut)
async def get_article(id: str, collection: str = Query(...), current_user: int = Depends(oauth.get_current_user)):
    
    db = get_db()
    try:
        # Ensure the ID is valid
        if collection == 'user':
            article = db.user_articles.find_one({"_id": ObjectId(id)})
        else:
            article = db.articles.find_one({"_id": ObjectId(id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid article ID")

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Convert the ObjectId to a string
    article = {key: value for key, value in article.items() if key not in ("created_at")}
    article['_id'] = str(article['_id'])
    return article  # Return dict directly instead of JSONResponse