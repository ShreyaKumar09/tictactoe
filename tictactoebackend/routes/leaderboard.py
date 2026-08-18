from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Player, Game

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("")
def leaderboard(db: Session = Depends(get_db)):

    leaderboard_data = (
        db.query(
            Player.name,
            func.count(Game.winner_id).label("wins")
        )
        .join(Game, Player.id == Game.winner_id)
        .filter(Game.winner_id.isnot(None))
        .group_by(Player.id, Player.name)
        .order_by(func.count(Game.winner_id).desc())
        .all()
    )

    return [
        {
            "name": row.name,
            "wins": row.wins
        }
        for row in leaderboard_data
    ]