# 🎮 Real-Time Multiplayer Tic Tac Toe

A production-ready real-time multiplayer Tic Tac Toe web application built with **React, FastAPI, PostgreSQL, Redis, and WebSockets**. The application supports live multiplayer gameplay, persistent match history, leaderboards, and an admin dashboard. It is fully containerized with Docker and deployed using modern cloud platforms.

---

## 🚀 Live Demo

**Frontend:** https://sktictactoegame.netlify.app

**Backend API:** https://tictactoe-q6bb.onrender.com

**Swagger Documentation:** https://tictactoe-q6bb.onrender.com/docs

---

# Features

### Multiplayer Gameplay

- Create Room
- Join Room using Room Code
- Real-time moves using WebSockets
- Turn-based gameplay
- Winner & Draw detection
- Rematch functionality

---

### Player Management

- Register Players
- Store Player Records
- Match History
- Leaderboard

---

### Admin Dashboard

- JWT Authentication
- Secure Login
- Dashboard Statistics
- Player Management
- Match History
- Clear Match History

---

### Backend Features

- REST APIs using FastAPI
- SQLAlchemy ORM
- PostgreSQL Database
- Redis Caching
- Rate Limiting
- Logging Middleware
- Dockerized Backend

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- CSS
- WebSocket API

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

## Database

- PostgreSQL (Neon)

## Cache

- Redis (Upstash)

## Authentication

- JWT
- bcrypt

## Deployment

- Netlify
- Render
- Docker

---

# Architecture

```
                 React (Netlify)
                       │
             REST + WebSockets
                       │
                FastAPI (Render)
                 │            │
                 │            │
                 ▼            ▼
      PostgreSQL (Neon)   Redis (Upstash)
```

---

# Folder Structure

```
tictactoe/

├── tictactoefront/
│   └── tictactoe/
│
├── tictactoebackend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── database.py
│   ├── redis_client.py
│   ├── Dockerfile
│   └── main.py
│
└── docker-compose.yml
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
```

## Backend

```bash
cd tictactoebackend

pip install -r requirements.txt

uvicorn main:app --reload
```

## Frontend

```bash
cd tictactoefront/tictactoe

npm install

npm run dev
```

---

# Environment Variables

Backend

```
DATABASE_URL=
REDIS_URL=
SECRET_KEY=
ALGORITHM=
```

---

# Deployment

| Service | Platform |
|----------|----------|
| Frontend | Netlify |
| Backend | Render |
| Database | Neon |
| Redis | Upstash |

---

# Key Concepts Implemented

- REST APIs
- WebSockets
- JWT Authentication
- PostgreSQL
- SQLAlchemy ORM
- Redis
- Docker
- Docker Compose
- Rate Limiting
- Middleware
- Cloud Deployment
- Environment Variables
- Production Debugging

---

# Future Improvements

- Friend System
- Spectator Mode
- Email Verification
- OAuth Login
- Match Replay
- CI/CD with GitHub Actions
- Kubernetes Deployment

---

# Author

Shreya Kumar
