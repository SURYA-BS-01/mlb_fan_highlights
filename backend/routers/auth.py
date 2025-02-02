from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from .. import database, schemas, oauth
from .password_utils import verify

router = APIRouter(
    tags=["Authentication"]
)

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db = Depends(database.get_db)):
    print(user_credentials.username, user_credentials.password)

    user = db.users_collection.find_one({"email": user_credentials.username})
    
    if not user or not verify(user_credentials.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    
    access_token = oauth.create_access_token(data={"user_id": str(user["_id"])})
    
    return {"access_token": access_token, "token_type": "bearer"}
