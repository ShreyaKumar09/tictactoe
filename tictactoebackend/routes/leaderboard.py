from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

import json
from redis_client import redis_client


from database import get_db
from models import Player, Game

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("")
def leaderboard(db: Session = Depends(get_db)):
    
    cached_data = redis_client.get("leaderboard")
    
    if cached_data:
        print("✅ Cache Hit")
        return json.loads(cached_data)

    print("❌ Cache Miss")
    
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

    result = [
        {
            "name": row.name,
            "wins": row.wins
        }
        for row in leaderboard_data
    ]

    redis_client.setex(
        "leaderboard",
        60,
        json.dumps(result)
    )

    print("💾 Leaderboard cached for 60 seconds")

    return result