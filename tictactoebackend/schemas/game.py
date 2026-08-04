from pydantic import BaseModel


class GameCreate(BaseModel):
    player1_id: int
    player2_id: int
    winner_id: int