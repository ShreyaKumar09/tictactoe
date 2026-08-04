from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Player, Game
from schemas import GameCreate

router = APIRouter(prefix="/games", tags=["Games"])


@router.post("")
def create_game(game: GameCreate, db: Session = Depends(get_db)):

    player1 = db.query(Player).filter(Player.id == game.player1_id).first()
    player2 = db.query(Player).filter(Player.id == game.player2_id).first()
    winner = db.query(Player).filter(Player.id == game.winner_id).first()

    if not player1 or not player2 or not winner:
        raise HTTPException(status_code=404, detail="Invalid player ID")

    new_game = Game(
        player1_id=game.player1_id,
        player2_id=game.player2_id,
        winner_id=game.winner_id,
    )

    db.add(new_game)
    db.commit()
    db.refresh(new_game)

    return {
        "message": "Game saved successfully!",
        "game": {
            "id": new_game.id,
            "player1_id": new_game.player1_id,
            "player2_id": new_game.player2_id,
            "winner_id": new_game.winner_id,
        },
    }