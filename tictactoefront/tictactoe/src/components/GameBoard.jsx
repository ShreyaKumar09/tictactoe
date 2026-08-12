
import React from "react";
import {
  FaUserCircle,
  FaCircle,
  FaTrophy,
  FaHistory,
  FaRedo,
  FaSignOutAlt,
  FaGamepad,
} from "react-icons/fa";

import Square from "./Square";
import Leaderboard from "./Leaderboard";
import MatchHistory from "./MatchHistory";

function GameBoard({
  board,
  winner,
  xTurn,
  player1Name,
  player2Name,
  refresh,
  resetGame,
  exitGame,
  handleClick,
}) {
  const isDraw = board.every((cell) => cell) && !winner;

  return (
    <div className="container">
      <div className="game-layout">

        {/* LEFT PLAYER */}
        <div className="player-card">
          <div className="player-avatar">
            <FaUserCircle />
          </div>

          <div className="player-name">
            {player1Name || "Player X"}
          </div>

          <div className="player-symbol">
            ❌ X
          </div>

          <br />

          <div>
            <span
              className={`status-dot ${
                xTurn && !winner ? "online" : "waiting"
              }`}
            ></span>

            {xTurn && !winner ? "Playing" : "Waiting"}
          </div>
        </div>

        {/* GAME */}
        <div className="middle-panel">

          <h1>
            <FaGamepad /> Tic Tac Toe
          </h1>

          <div className="status">
            {winner
              ? `🏆 Winner : ${
                  winner === "X"
                    ? player1Name
                    : player2Name
                }`
              : isDraw
              ? "🤝 It's a Draw!"
              : `🎯 ${
                  xTurn
                    ? `${player1Name}'s Turn`
                    : `${player2Name}'s Turn`
                }`}
          </div>

          <div className="board">
            {board.map((value, index) => (
              <Square
                key={index}
                value={value}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>

          {(winner || isDraw) && (
            <div className="game-buttons">

              <button onClick={resetGame}>
                <FaRedo /> Restart
              </button>

              <button onClick={exitGame}>
                <FaSignOutAlt /> Exit
              </button>

            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="sidebar">

          <section>

            <h2>
              <FaTrophy /> Leaderboard
            </h2>

            <Leaderboard refresh={refresh} />

          </section>

          <section>

            <h2>
              <FaHistory /> Match History
            </h2>

            <MatchHistory refresh={refresh} />

          </section>

        </div>

      </div>
    </div>
  );
}

export default GameBoard;

