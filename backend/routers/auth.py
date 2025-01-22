from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from .password_utils import verify
from .. import database, schemas, models, oauth
import jwt

router = APIRouter(
    tags = ["Authentication"]
)

@router.post("/login", response_model = schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends() ,db: Session = Depends(database.get_db)):

    # Because we're using OAuth2PasswordRequestForm, the data is in the form
    # {
    #     "username": "...",
    #     "password": "..."
    # }

    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    if not verify(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    # Create a token

    access_token = oauth.create_access_token(data= {"user_id": user.id})

    return {"access_token": access_token ,"token_type": "bearer"}

