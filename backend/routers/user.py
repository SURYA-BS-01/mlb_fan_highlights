from fastapi import status, HTTPException, Depends, APIRouter
from .. import schemas, database
from .password_utils import hash
from bson import ObjectId
from datetime import datetime
from ..utils import send_welcome_email

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db = Depends(database.get_db)):

    try:
        print(user.email)
        send_welcome_email(user.email)
    except Exception as e:
        print("Error")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not valid")

    # Check if user already exists
    if db.users_collection.find_one({"email": user.email}):
        print("error")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = hash(user.password)
    user.password = hashed_password
    user_data = {**user.model_dump(), "created_at": datetime.utcnow()}
    print(user_data)
    # Insert user into MongoDB
    result = db.users_collection.insert_one(user_data)
    
    return {"id": str(result.inserted_id), "email": user.email}

@router.get("/{id}", response_model=schemas.UserOut)
def get_user(id: str, db = Depends(database.get_db)):
    user = db.users_collection.find_one({"_id": ObjectId(id)})
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id: {id} does not exist")
    
    return {"id": str(user["_id"]), "email": user["email"]}
