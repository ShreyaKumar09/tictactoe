from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware.logging_middleware import LoggingMiddleware

from routes.player import router as player_router
from routes.game import router as game_router
from routes.match_history import router as match_history_router
from routes.leaderboard import router as leaderboard_router
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from routes.websocket import router as websocket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)


@app.get("/")
def home():
    return {"message": "Welcome to Tic Tac Toe API"}


app.include_router(player_router)
app.include_router(game_router)
app.include_router(match_history_router)
app.include_router(leaderboard_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(websocket_router)