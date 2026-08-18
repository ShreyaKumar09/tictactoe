from pydantic import BaseModel


class GameCreate(BaseModel):
    match_key: str
    player1_id: int
    player2_id: int
    winner_id: int | None = None