import React, { useState, useEffect } from "react";
import "../App.css";
import api from "../api";
import Leaderboard from "../components/Leaderboard";
import MatchHistory from "../components/MatchHistory";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaHistory,
  FaSignInAlt,
  FaDoorOpen
} from "react-icons/fa";

function Square({ value, onClick }) {

  let className = "square";

  if (value === "X") {
    className += " x-square";
  } else if (value === "O") {
    className += " o-square";
  }

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const winner = calculateWinner(board);

  async function startGame() {
    if (!player1Name || !player2Name) {
      alert("Enter both player names");
      return;
    }

    try {
      const res1 = await api.post("/players", {
        name: player1Name,
      });

      const res2 = await api.post("/players", {
        name: player2Name,
      });

      setPlayer1Id(res1.data.player.id);
      setPlayer2Id(res2.data.player.id);

      setGameStarted(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xTurn ? "X" : "O";

    setBoard(newBoard);
    setXTurn(!xTurn);
  }

  useEffect(() => {
    async function saveGame() {
      if (!winner) return;

      const winnerId = winner === "X" ? player1Id : player2Id;

      try {
        await api.post("/games", {
          player1_id: player1Id,
          player2_id: player2Id,
          winner_id: winnerId,
        });

        setRefresh((prev) => prev + 1);

        alert("Game Saved!");
      } catch (err) {
        console.log(err);
      }
    }

    if (gameStarted) {
      saveGame();
    }
  }, [winner]);

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  }

  function exitGame() {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the game?"
    );

    if (!confirmExit) return;

    setBoard(Array(9).fill(null));
    setXTurn(true);

    setPlayer1Name("");
    setPlayer2Name("");

    setPlayer1Id(null);
    setPlayer2Id(null);

    setGameStarted(false);
  }

  if (!gameStarted) {
    return (
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <p className="subtitle">
  Challenge your friends and climb the leaderboard!
</p>

        <input
          type="text"
          placeholder="Player 1 (X)"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />

        <input
          type="text"
          placeholder="Player 2 (O)"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
        />

        <button className="start-btn" onClick={startGame}>
          Start Game
        </button>

        {/* Admin Login Button */}
        <div style={{ marginTop: "20px" }}>
          <Link to="/admin-login">
            <button className="start-btn">⚙ Admin Login</button>
          </Link>
        </div>

        <Leaderboard refresh={refresh} />
        <MatchHistory refresh={refresh} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <h3>
        {player1Name} (X) vs {player2Name} (O)
      </h3>
      <h2>
        <FaTrophy /> Leaderboard
      </h2>
      <h2>
        <FaHistory /> Match History
      </h2>
      

      <div className="status">
        {winner
          ? `Winner: ${winner === "X" ? player1Name : player2Name}`
          : board.every((cell) => cell)
          ? "It's a Draw!"
          : `Turn: ${xTurn ? player1Name : player2Name}`}
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

      {(winner || board.every((cell) => cell)) && (
        <div className="game-buttons">
          <button onClick={resetGame}>Restart Game</button>
          <button onClick={exitGame}>Exit Game</button>
        </div>
      )}

      <div className="dashboard">
        <Leaderboard refresh={refresh} />
        <MatchHistory refresh={refresh} />
      </div>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export default Home;