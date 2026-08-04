from pydantic import BaseModel


class PlayerCreate(BaseModel):
    name: str