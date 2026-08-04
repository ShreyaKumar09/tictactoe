from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Game

from dependencies.auth import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    username: str = Depends(get_current_admin)
):

    return {
        "message": f"Welcome {username}",
        "status": "Admin Logged In"
    }


@router.delete("/match-history")
def clear_match_history(
    username: str = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    deleted_games = db.query(Game).delete()

    db.commit()

    return {
        "message": "Match history cleared successfully.",
        "games_deleted": deleted_games,
        "admin": username
    }