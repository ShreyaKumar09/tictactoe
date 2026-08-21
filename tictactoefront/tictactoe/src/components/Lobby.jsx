import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGamepad,
  FaRocket,
  FaSignInAlt,
  FaCog,
  FaCopy,
  FaCheck,
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
  const [copied, setCopied] = useState(false);

  function copyRoomCode() {
    navigator.clipboard.writeText(roomId);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

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

        {/* Player Name */}
        <input
          type="text"
          placeholder="👤 Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        {/* Create Room */}
        <button
          className="start-btn"
          onClick={createRoom}
        >
          <FaRocket /> Create Room
        </button>

        {/* Show Room Code only after creating */}
        {roomId && isHost && (
          <div className="created-room">

            <div className="created-room-title">
              Room Created
            </div>

            <div className="room-code-row">

              <span className="room-code">
                {roomId}
              </span>

              <button
                className="copy-room-btn"
                onClick={copyRoomCode}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                &nbsp;
                {copied ? "Copied" : "Copy"}
              </button>

            </div>

            <p className="room-share-text">
              Share this code with your friend.
            </p>

          </div>
        )}

        <div className="or">
          ───── OR ─────
        </div>

        {/* Join Room */}
        <input
          type="text"
          placeholder="🔑 Enter Room Code"
          value={roomId}
          onChange={(e) =>
            setRoomId(e.target.value.toUpperCase())
          }
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
          <button className="start-btn admin-btn">
            <FaCog /> Admin Login
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Lobby;