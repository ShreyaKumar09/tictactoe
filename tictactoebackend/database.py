from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, pool_pre_ping=True,
    pool_recycle=300,)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def ensure_game_table_schema():
    try:
        with engine.begin() as connection:
            if engine.dialect.name == "postgresql":
                connection.execute(text("ALTER TABLE games ADD COLUMN IF NOT EXISTS match_key VARCHAR"))
                connection.execute(text("UPDATE games SET match_key = CONCAT(CAST(player1_id AS TEXT), '-', CAST(player2_id AS TEXT), '-', COALESCE(CAST(winner_id AS TEXT), 'draw')) WHERE match_key IS NULL"))
                connection.execute(text("DELETE FROM games a USING games b WHERE a.id < b.id AND a.match_key = b.match_key"))
                connection.execute(text("ALTER TABLE games ALTER COLUMN winner_id DROP NOT NULL"))
                connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_games_match_key_unique ON games (match_key) WHERE match_key IS NOT NULL"))
    except Exception:
        pass


ensure_game_table_schema()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()