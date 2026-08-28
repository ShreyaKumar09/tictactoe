# 🎮 Tic Tac Toe Multiplayer

A full-stack real-time multiplayer Tic Tac Toe application built using **React**, **FastAPI**, **PostgreSQL**, **WebSockets**, and **Docker**. Players can create or join game rooms, play in real time, view match history and leaderboard, while administrators can manage the application through a secure dashboard.

---

## 📌 Features

### 🎮 Multiplayer Gameplay
- Create and join game rooms
- Real-time synchronization using WebSockets
- Turn-based gameplay
- Restart game functionality
- Draw detection
- Winner announcement

### 👤 Player Management
- Register players
- Store player information in PostgreSQL
- Player statistics

### 🏆 Leaderboard
- Displays players ranked by wins
- Automatically updates after every completed game

### 📜 Match History
- Stores every completed match
- Displays:
  - Player 1
  - Player 2
  - Winner
  - Draw matches

### 👨‍💼 Admin Panel
- Secure Admin Login (JWT Authentication)
- Dashboard Statistics
- Total Players
- Total Games
- Total Wins
- Active Rooms

### 🔐 Authentication
- JWT Token Authentication
- Password Hashing using Passlib (bcrypt)

### 🐳 Dockerized Application
- Frontend Container
- Backend Container
- PostgreSQL Container
- Docker Compose orchestration

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- JavaScript
- CSS

## Backend
- FastAPI
- SQLAlchemy
- JWT Authentication
- WebSockets

## Database
- PostgreSQL

## DevOps
- Docker
- Docker Compose

---

# 📂 Project Structure

```
tictactoe/
│
├── docker-compose.yml
├── .gitignore
├── .dockerignore
├── README.md
│
├── tictactoebackend/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── database.py
│   ├── models.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── tictactoefront/
    └── tictactoe/
        ├── src/
        ├── public/
        ├── package.json
        └── Dockerfile
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tictactoe.git

cd tictactoe
```

---

# ⚙️ Environment Variables

## Backend (`tictactoebackend/.env`)

```env
DATABASE_URL=postgresql://postgres:your_password@postgres:5432/tictactoe_db

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Docker Compose (`.env`)

```env
POSTGRES_USER=postgres

POSTGRES_PASSWORD=your_password

POSTGRES_DB=tictactoe_db
```

---

# 🐳 Running with Docker

Build and start all containers

```bash
docker compose up --build
```

Stop containers

```bash
docker compose down
```

---

# 🌐 Application URLs

Frontend

```
http://localhost:5173
```

Backend API

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# 📊 Database

PostgreSQL stores:

- Players
- Games
- Match History
- Leaderboard Data
- Admin Credentials

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Environment Variables
- Docker Networking
- Docker Volumes for Persistent Database Storage

---

# 🧪 Features Demonstrated

- CRUD Operations
- REST APIs
- SQLAlchemy ORM
- PostgreSQL Relationships
- FastAPI Dependency Injection
- Middleware
- JWT Authentication
- Password Hashing
- WebSockets
- Docker Containers
- Docker Compose
- Docker Networking
- Docker Volumes
- Environment Variables
- Git & GitHub Best Practices

---

# 📸 Screenshots

You can add screenshots of:

- Home Page
- Multiplayer Lobby
- Gameplay
- Winner Screen
- Leaderboard
- Match History
- Admin Login
- Admin Dashboard
- Docker Containers Running

Example:

```
screenshots/
│
├── home.png
├── gameplay.png
├── leaderboard.png
├── admin-dashboard.png
```

---

# 🧠 What I Learned

Through this project, I gained hands-on experience with:

- Building REST APIs using FastAPI
- Designing relational databases with PostgreSQL
- SQLAlchemy ORM and Relationships
- JWT Authentication
- Real-time communication using WebSockets
- Dockerizing a Full Stack Application
- Docker Compose
- Environment Variables
- Git Branching & Version Control
- Debugging Backend and Docker Issues

---

# 👩‍💻 Author

**Shreya Kumar**

GitHub: https://github.com/ShreyaKumar09

---

# ⭐ If you like this project

If you found this project helpful or interesting, consider giving it a ⭐ on GitHub!