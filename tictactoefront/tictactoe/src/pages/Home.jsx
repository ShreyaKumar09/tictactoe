import React, { useState, useEffect } from "react";
import api from "../services/api";
import Lobby from "../components/Lobby";
import GameBoard from "../components/GameBoard";
import { useWebSocket } from "../context/WebSocketContext";

function Home() {
  // ---------------------------------------------------------
  // GAME STATE
  // ---------------------------------------------------------

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // ---------------------------------------------------------
  // MULTIPLAYER STATE
  // ---------------------------------------------------------

  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const [mySymbol, setMySymbol] = useState("");

  const { send, lastMessage } = useWebSocket();

  const winner = calculateWinner(board);

  // ---------------------------------------------------------
  // WEBSOCKET
  // ---------------------------------------------------------

  useEffect(() => {
    if (!lastMessage) return;

    console.log("Received:", lastMessage);

    switch (lastMessage.action) {
      case "room_created":
        setRoomId(lastMessage.room_id);

        alert(`Room Created!\nRoom ID: ${lastMessage.room_id}`);
        break;

      case "game_start": {
        const players = lastMessage.players;

        if (players.length >= 2) {
          setPlayer1Name(players[0].name);
          setPlayer2Name(players[1].name);

          const me = players.find(
            (player) => player.name === playerName
          );

          if (me) {
            setMySymbol(me.symbol);
            console.log("My Symbol:", me.symbol);
          }

          setPlayer1Id(players[0].id ?? null);
          setPlayer2Id(players[1].id ?? null);
        }

        setBoard(Array(9).fill(null));
        setXTurn(lastMessage.turn === "X");
        setGameStarted(true);
        break;
      }

      case "update_board":
        setBoard(lastMessage.board);
        setXTurn(lastMessage.turn === "X");
        break;

      case "error":
        alert(lastMessage.message);
        break;

      default:
        console.log("Unknown message:", lastMessage);
    }
  }, [lastMessage, playerName]);

  // ---------------------------------------------------------
  // CREATE ROOM
  // ---------------------------------------------------------

  function createRoom() {
    if (!playerName.trim()) {
      alert("Enter your name");
      return;
    }

    setIsHost(true);

    send({
      action: "create_room",
      player_name: playerName,
    });
  }

  // ---------------------------------------------------------
  // JOIN ROOM
  // ---------------------------------------------------------

  function joinRoom() {
    if (!playerName.trim() || !roomId.trim()) {
      alert("Enter your name and room ID");
      return;
    }

    setIsHost(false);

    send({
      action: "join_room",
      room_id: roomId,
      player_name: playerName,
    });
  }

  // ---------------------------------------------------------
  // HANDLE CLICK
  // ---------------------------------------------------------

  function handleClick(index) {
    if (winner) return;

    if (board[index]) return;

    const myTurn =
      (xTurn && mySymbol === "X") ||
      (!xTurn && mySymbol === "O");

    if (!myTurn) return;

    send({
      action: "move",
      room_id: roomId,
      index,
    });
  }

  // ---------------------------------------------------------
  // SAVE GAME
  // ---------------------------------------------------------

  useEffect(() => {
    if (!winner || !gameStarted) return;

    async function saveGame() {
      try {
        const winnerId =
          winner === "X" ? player1Id : player2Id;

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

    saveGame();
  }, [winner]);

  // ---------------------------------------------------------
  // RESET
  // ---------------------------------------------------------

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  }

  // ---------------------------------------------------------
  // EXIT
  // ---------------------------------------------------------

  function exitGame() {
    if (!window.confirm("Are you sure you want to exit?")) return;

    setBoard(Array(9).fill(null));
    setXTurn(true);

    setGameStarted(false);

    setPlayerName("");
    setRoomId("");

    setPlayer1Name("");
    setPlayer2Name("");

    setPlayer1Id(null);
    setPlayer2Id(null);

    setMySymbol("");
  }

  // ---------------------------------------------------------
  // LOBBY
  // ---------------------------------------------------------

  if (!gameStarted) {
    return (
      <Lobby
        playerName={playerName}
        setPlayerName={setPlayerName}
        roomId={roomId}
        setRoomId={setRoomId}
        createRoom={createRoom}
        joinRoom={joinRoom}
        refresh={refresh}
      />
    );
  }

  // ---------------------------------------------------------
  // GAME
  // ---------------------------------------------------------

  return (
    <GameBoard
      board={board}
      winner={winner}
      xTurn={xTurn}
      player1Name={player1Name}
      player2Name={player2Name}
      mySymbol={mySymbol}
      roomId={roomId}
      refresh={refresh}
      resetGame={resetGame}
      exitGame={exitGame}
      handleClick={handleClick}
    />
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

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

export default Home;

