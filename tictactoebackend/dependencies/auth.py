from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from utils.jwt import verify_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_admin(
    token: str = Depends(oauth2_scheme)
):

    username = verify_token(token)

    if username is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return username