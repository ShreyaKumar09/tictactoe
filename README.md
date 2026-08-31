# 🎮 Tic Tac Toe Multiplayer

A full-stack real-time multiplayer Tic Tac Toe web application built using **React**, **FastAPI**, **PostgreSQL**, **Redis**, **WebSockets**, **Docker**, and **Git**. The application allows two players to play in real time while maintaining player statistics, match history, leaderboards, and an admin dashboard. It also incorporates production-oriented concepts such as caching, rate limiting, background tasks, containerization, and version control.

---

# 📌 Project Overview

This project demonstrates a modern full-stack web application using React for the frontend and FastAPI for the backend. It supports multiplayer gameplay through WebSockets, stores persistent data in PostgreSQL, improves performance using Redis, and runs the complete application using Docker Compose.

---

# ✨ Features

## 🎮 Gameplay

- Real-time Multiplayer using WebSockets
- Create Room
- Join Room
- Room Code Sharing
- Turn-Based Synchronization
- Winner Detection
- Draw Detection
- Restart / Rematch System
- Theme Toggle (Dark / Light)

---

## 👤 Player Management

- Player Registration
- Store Player Details
- Match History
- Leaderboard
- Winner Tracking

---

## 🔐 Authentication & Security

- Admin Login
- JWT Authentication
- Protected Admin Routes
- CORS Middleware
- Environment Variables

---

## 📊 Admin Dashboard

- Total Players
- Games Played
- Total Wins
- Active Rooms
- Match History Management

---

# ⚡ Performance Optimizations

## 🔴 Redis Caching

Leaderboard data is cached in Redis to reduce repeated database queries.

### Workflow

```
Client
   │
   ▼
Redis Cache
   │
   ├── Cache Hit ✅
   │       │
   │       ▼
   │   Return Cached Data
   │
   └── Cache Miss ❌
           │
           ▼
      PostgreSQL
           │
           ▼
 Cache Result for 60 Seconds
```

---

## 🗑 Cache Invalidation

Whenever a game is completed:

- Game is saved to PostgreSQL
- Existing leaderboard cache is deleted
- Next leaderboard request rebuilds the cache

This ensures users always receive updated rankings.

---

## 🚦 Rate Limiting

Implemented using **SlowAPI** with **Redis**.

Purpose:

- Prevent API abuse
- Protect backend resources
- Reduce unnecessary requests
- Improve server stability

Example:

```
5 Requests / Minute

↓

HTTP 429 Too Many Requests
```

---

## ⚙ Background Tasks

FastAPI Background Tasks execute time-consuming operations after the response is sent.

Example:

- Generate Match Report
- Logging
- Notifications

Workflow:

```
Save Game

↓

Response Sent

↓

Generate Match Report
```

---

# 🐳 Docker

The application is fully containerized.

Containers:

- Frontend
- Backend
- PostgreSQL
- Redis

Docker Compose manages:

- Container Creation
- Networking
- Volumes
- Service Communication

---

# 🔴 Redis

Redis is used for:

- Leaderboard Caching
- Rate Limiting
- Temporary In-Memory Storage

Advantages:

- Extremely Fast
- Key-Value Database
- Automatic Expiration (TTL)
- Reduces Database Load

---

# 🗄 Database

PostgreSQL stores:

- Players
- Games
- Match History
- Admin Accounts

SQLAlchemy ORM is used for:

- CRUD Operations
- Relationships
- Database Sessions

---

# 🌐 API Endpoints

## Players

```
POST /players
GET /players
```

---

## Games

```
POST /games
```

---

## Leaderboard

```
GET /leaderboard
```

---

## Match History

```
GET /match-history
```

---

## Authentication

```
POST /auth/login
```

---

## Admin

```
GET /admin/dashboard
GET /admin/dashboard-stats
DELETE /admin/match-history
```

---

# 🔌 WebSocket

```
ws://localhost:8000/ws
```

Supported Events

- Create Room
- Join Room
- Move
- Restart Request
- Restart Accept
- Disconnect

---

# 🏗 Tech Stack

## Frontend

- React
- Vite
- React Context API
- CSS

---

## Backend

- FastAPI
- SQLAlchemy
- WebSockets
- JWT Authentication
- SlowAPI
- Background Tasks

---

## Database

- PostgreSQL

---

## Cache

- Redis

---

## Containerization

- Docker
- Docker Compose

---

## Version Control

- Git
- GitHub

---

# 🌿 Git Workflow

The project follows a Git branching strategy for organized development.

### Branches

- **main** – Stable production-ready code
- **dev** – Development branch for new features
- **production** – Deployment-ready branch

### Git Concepts Used

- Repository Initialization
- Branch Creation
- Branch Switching
- Merge
- Push & Pull
- Conflict Resolution
- `.gitignore`
- Removing Sensitive Files (`.env`)
- Docker-Friendly Repository Structure

---

# 📂 Project Structure

```
tictactoe/

│
├── docker-compose.yml
├── .gitignore
├── README.md
│
├── tictactoebackend/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── middleware/
│   ├── utils/
│   ├── Dockerfile
│
├── tictactoefront/
│   ├── src/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── pages/
│   ├── Dockerfile
```

---

# ▶ Running the Project

## Using Docker

```bash
docker compose up --build
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# ⚙ Environment Variables

Backend

```
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

---

# 🧠 Concepts Implemented

### Backend

- REST API Development
- CRUD Operations
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication
- Protected Routes
- Background Tasks
- Logging Middleware
- Rate Limiting
- Redis Caching
- Cache Invalidation
- WebSockets
- Real-Time Communication

### Frontend

- React
- React Context API
- Component-Based Architecture
- Theme Switching

### DevOps

- Docker
- Docker Compose
- Docker Networking
- Docker Volumes
- Environment Variables

### Version Control

- Git
- GitHub
- Branching Strategy
- Merge
- Conflict Resolution
- `.gitignore`

---

# 🚀 Future Improvements

- Email Notifications
- Tournament Mode
- Spectator Mode
- AI Opponent
- Online Presence Indicator
- Game Analytics
- Cloud Deployment
- CI/CD Pipeline

---

# 👩‍💻 Author

**Shreya Kumar**

### Tech Stack

- React
- FastAPI
- PostgreSQL
- Redis
- WebSockets
- Docker
- Git & GitHub