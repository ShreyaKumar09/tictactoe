from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)

    player1_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    player2_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    winner_id = Column(Integer, ForeignKey("players.id"), nullable=False)

    player1 = relationship("Player", foreign_keys=[player1_id])
    player2 = relationship("Player", foreign_keys=[player2_id])
    winner = relationship("Player", foreign_keys=[winner_id])