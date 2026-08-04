from database import Base, engine

# Import models so SQLAlchemy knows about them
from models.player import Player
from models.game import Game
from models.admin import Admin

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")