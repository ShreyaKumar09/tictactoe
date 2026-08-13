
import React from "react";
import { Link } from "react-router-dom";
import {
  FaGamepad,
  FaUser,
  FaKey,
  FaRocket,
  FaSignInAlt,
  FaCog,
} from "react-icons/fa";

import ThemeToggle from "./ThemeToggle";

function Lobby({
  playerName,
  setPlayerName,
  roomId,
  setRoomId,
  createRoom,
  joinRoom,
  isHost,
  refresh,
}) {
  return (
    <div className="container">
      <div className="lobby-card">

        <div className="theme-container">
          <ThemeToggle />
        </div>

        <h1>
          <FaGamepad /> Tic Tac Toe
        </h1>

        <p className="subtitle">
          Play online with your friends anywhere in the world.
        </p>

        <input
          type="text"
          placeholder="👤 Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button
          className="start-btn"
          onClick={createRoom}
        >
          <FaRocket /> Create Room
        </button>

        <div className="or">
          ───── OR ─────
        </div>

        <input
          type="text"
          placeholder="🔑 Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        />

        <button
          className="start-btn"
          onClick={joinRoom}
        >
          <FaSignInAlt /> Join Room
        </button>

        <Link
          to="/admin-login"
          style={{ textDecoration: "none" }}
        >
          <button
            className="start-btn admin-btn"
          >
            <FaCog /> Admin Login
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Lobby;

