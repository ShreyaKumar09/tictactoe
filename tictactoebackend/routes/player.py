from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Player
from schemas import PlayerCreate

router = APIRouter(prefix="/players", tags=["Players"])


@router.post("")
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):

    player_name = player.name.strip()

    if not player_name:
        raise HTTPException(status_code=400, detail="Player name cannot be empty")

    existing_player = (
        db.query(Player)
        .filter(func.lower(Player.name) == player_name.lower())
        .first()
    )

    if existing_player:
        return {
            "message": "Player already exists",
            "player": {
                "id": existing_player.id,
                "name": existing_player.name
            }
        }

    new_player = Player(name=player_name)

    db.add(new_player)
    db.commit()
    db.refresh(new_player)

    return {
        "message": "Player created successfully!",
        "player": {
            "id": new_player.id,
            "name": new_player.name
        }
    }


@router.get("")
def get_players(db: Session = Depends(get_db)):
    players = db.query(Player).all()

    return [
        {
            "id": p.id,
            "name": p.name
        }
        for p in players
    ]