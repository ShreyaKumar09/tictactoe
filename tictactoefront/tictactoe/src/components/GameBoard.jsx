import React from "react";
import {
  FaUserCircle,
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
  mySymbol,
  roomId,
  refresh,
  exitGame,
  handleClick,
  requestRestart,
  restartRequested,
  restartWaiting,
  restartRequester,
  acceptRestart,
  declineRestart,
}) {
  // ---------------------------------------------------------
  // GAME STATUS
  // ---------------------------------------------------------

  const isDraw = board.every((cell) => cell) && !winner;

  const myTurn =
    (xTurn && mySymbol === "X") ||
    (!xTurn && mySymbol === "O");

  const player1IsPlaying =
    xTurn && !winner && !isDraw;

  const player2IsPlaying =
    !xTurn && !winner && !isDraw;

  // ---------------------------------------------------------
  // PLAYER STATUS
  // ---------------------------------------------------------

  function getPlayerStatus(symbol) {
    if (winner) {
      return winner === symbol ? "Winner" : "Lost";
    }

    if (isDraw) {
      return "Draw";
    }

    if (
      (xTurn && symbol === "X") ||
      (!xTurn && symbol === "O")
    ) {
      return "Playing";
    }

    return "Waiting";
  }

  // ---------------------------------------------------------
  // PLAYER CARD
  // ---------------------------------------------------------

  function PlayerCard({ name, symbol, isPlaying }) {
    const isMe = mySymbol === symbol;

    return (
      <div
        className={`player-card ${
          isPlaying ? "active-player" : ""
        } ${isMe ? "my-player" : ""}`}
      >
        <div className="player-avatar">
          <FaUserCircle />
        </div>

        <div className="player-label">
          {isMe ? "YOU" : "OPPONENT"}
        </div>

        <div className="player-name">
          {name || `Player ${symbol}`}
        </div>

        <div
          className={`player-symbol ${
            symbol === "X"
              ? "symbol-x"
              : "symbol-o"
          }`}
        >
          {symbol === "X" ? "❌" : "⭕"} {symbol}
        </div>

        <div className="player-status">
          <span
            className={`status-dot ${
              isPlaying
                ? "online"
                : "waiting"
            }`}
          />

          {getPlayerStatus(symbol)}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // GAME STATUS MESSAGE
  // ---------------------------------------------------------

  function renderGameStatus() {
    if (winner) {
      if (winner === mySymbol) {
        return (
          <div className="result-message winner-message">
            🏆 You Won!
          </div>
        );
      }

      return (
        <div className="result-message loser-message">
          😔 You Lost!
        </div>
      );
    }

    if (isDraw) {
      return (
        <div className="result-message draw-message">
          🤝 It's a Draw!
        </div>
      );
    }

    if (myTurn) {
      return (
        <div className="turn-message your-turn">
          🎯 Your Turn
        </div>
      );
    }

    return (
      <div className="turn-message opponent-turn">
        ⏳ Opponent's Turn
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN UI
  // ---------------------------------------------------------

  return (
    <div className="container">

      <div className="game-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="game-header">

          <h1>
            <FaGamepad />
            Tic Tac Toe
          </h1>

          <div className="room-display">
            Room:{" "}
            <strong>
              {roomId || "ONLINE"}
            </strong>
          </div>

        </div>

        {/* =================================================
            GAME AREA
        ================================================= */}

        <div className="game-layout">

          {/* =================================================
              PLAYER X
          ================================================= */}

          <PlayerCard
            name={player1Name}
            symbol="X"
            isPlaying={player1IsPlaying}
          />

          {/* =================================================
              CENTER GAME
          ================================================= */}

          <div className="middle-panel">

            {/* VS */}

            <div className="game-vs">

              <span>
                {player1Name || "Player X"}
              </span>

              <strong>VS</strong>

              <span>
                {player2Name || "Player O"}
              </span>

            </div>

            {/* STATUS */}

            <div className="status">
              {renderGameStatus()}
            </div>

            {/* =================================================
                REMATCH REQUEST
            ================================================= */}

            {restartRequester && (
              <div className="restart-request">

                <p>
                  <strong>
                    {restartRequester}
                  </strong>{" "}
                  wants to play again!
                </p>

                <div className="restart-request-buttons">

                  <button
                    className="restart-btn"
                    onClick={acceptRestart}
                  >
                    ✅ Accept
                  </button>

                  <button
                    className="exit-btn"
                    onClick={() => {
                      // Decline will be connected next
                    }}
                  >
                    ❌ Decline
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                BOARD
            ================================================= */}

            <div className="board">

              {board.map((value, index) => (
                <Square
                  key={index}
                  value={value}
                  onClick={() =>
                    handleClick(index)
                  }
                />
              ))}

            </div>

            {/* =================================================
                GAME BUTTONS
            ================================================= */}

            {(winner || isDraw) && (
              <div className="game-buttons">

                {/* -----------------------------------------
                    NORMAL STATE
                ----------------------------------------- */}

                {!restartRequested &&
                  !restartWaiting && (
                    <>
                      <button
                        className="restart-btn"
                        onClick={requestRestart}
                      >
                        <FaRedo />
                        Play Again
                      </button>

                      <button
                        className="exit-btn"
                        onClick={exitGame}
                      >
                        <FaSignOutAlt />
                        Exit
                      </button>
                    </>
                  )}

                {/* -----------------------------------------
                    WAITING FOR OPPONENT
                ----------------------------------------- */}

                {restartRequested &&
                  restartWaiting && (
                    <>
                      <div className="restart-waiting">
                        Waiting for opponent...
                      </div>

                      <button
                        className="exit-btn"
                        onClick={exitGame}
                      >
                        <FaSignOutAlt />
                        Exit
                      </button>
                    </>
                  )}

              </div>
            )}

          </div>

          {/* =================================================
              PLAYER O
          ================================================= */}

          <PlayerCard
            name={player2Name}
            symbol="O"
            isPlaying={player2IsPlaying}
          />

        </div>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <div className="dashboard">

          {/* =================================================
              LEADERBOARD
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-title">

              <FaTrophy />

              <h2>
                Leaderboard
              </h2>

            </div>

            <Leaderboard
              refresh={refresh}
            />

          </section>

          {/* =================================================
              MATCH HISTORY
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-title">

              <FaHistory />

              <h2>
                Match History
              </h2>

            </div>

            <MatchHistory
              refresh={refresh}
            />

          </section>

        </div>

      </div>

    </div>
  );
}

export default GameBoard;