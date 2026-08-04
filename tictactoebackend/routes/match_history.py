from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Game

router = APIRouter(prefix="/match-history", tags=["Match History"])


@router.get("")
def get_match_history(db: Session = Depends(get_db)):

    games = db.query(Game).all()

    return [
        {
            "id": game.id,
            "player1": game.player1.name,
            "player2": game.player2.name,
            "winner": game.winner.name,
        }
        for game in games
    ]