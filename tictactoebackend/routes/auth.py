from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import Admin
from utils.security import verify_password
from utils.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    admin = (
        db.query(Admin)
        .filter(Admin.username == form_data.username)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        form_data.password,
        admin.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        {
            "sub": admin.username
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }