import React, { useState, useEffect, useRef } from "react";
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
  const playerNameRef = useRef("");

  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);

  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const [mySymbol, setMySymbol] = useState("");

  // ---------------------------------------------------------
  // RESTART STATE
  // ---------------------------------------------------------

  const [restartRequested, setRestartRequested] = useState(false);
  const [restartWaiting, setRestartWaiting] = useState(false);
  const [restartRequester, setRestartRequester] = useState("");

  const { send, lastMessage } = useWebSocket();

  const winner = calculateWinner(board);

  // ---------------------------------------------------------
  // RESET TO LOBBY
  // ---------------------------------------------------------

  function resetToLobby() {
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

    setRestartRequested(false);
    setRestartWaiting(false);
    setRestartRequester("");
  }

  // ---------------------------------------------------------
  // WEBSOCKET
  // ---------------------------------------------------------

  useEffect(() => {
    if (!lastMessage) return;

    console.log("Received:", lastMessage);

    switch (lastMessage.action) {
      // =====================================================
      // ROOM CREATED
      // =====================================================

      case "room_created":

        setRoomId(lastMessage.room_id);

        alert(
          `Room Created!\nRoom ID: ${lastMessage.room_id}`
        );

        break;

      // =====================================================
      // GAME START
      // =====================================================

      case "game_start": {
        const players = lastMessage.players;

        if (players.length >= 2) {
          setPlayer1Name(players[0].name);
          setPlayer2Name(players[1].name);

          const me = players.find(
            (player) => player.name === playerNameRef.current
          );

          if (me) {
            setMySymbol(me.symbol);

            console.log(
              "My Symbol:",
              me.symbol
            );
          }

          setPlayer1Id(
            players[0].id ?? null
          );

          setPlayer2Id(
            players[1].id ?? null
          );
        }

        setBoard(
          Array(9).fill(null)
        );

        setXTurn(
          lastMessage.turn === "X"
        );

        setGameStarted(true);

        // Clear restart state
        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");

        break;
      }

      // =====================================================
      // BOARD UPDATE
      // =====================================================

      case "update_board":

        setBoard(lastMessage.board);

        setXTurn(
          lastMessage.turn === "X"
        );

        break;

      // =====================================================
      // RESTART REQUEST RECEIVED
      // =====================================================

      case "restart_request_received":

        console.log(
          "🔄 Opponent requested a rematch"
        );

        setRestartRequested(false);
        setRestartWaiting(false);

        /*
         * We don't receive the opponent's name
         * from the backend currently, so use
         * the opponent's player name.
         */

        const opponentName =
          playerName === player1Name
            ? player2Name
            : player1Name;

        setRestartRequester(
          opponentName || "Opponent"
        );

        break;

      // =====================================================
      // RESTART GAME
      // =====================================================

      case "restart_game":

        console.log(
          "🔄 Restarting game"
        );

        setBoard(
          Array(9).fill(null)
        );

        setXTurn(
          lastMessage.turn === "X"
        );

        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");

        break;

      // =====================================================
      // RESTART DECLINED
      // =====================================================

      case "restart_declined":

        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");

        alert(
          "Opponent declined the rematch."
        );

        resetToLobby();

        break;

      // =====================================================
      // RESTART CANCELLED
      // =====================================================

      case "restart_cancelled":

        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");

        alert(
          "Opponent cancelled the restart request."
        );

        resetToLobby();

        break;

      // =====================================================
      // RESTART EXPIRED
      // =====================================================

      case "restart_expired":

        console.log(
          "⏰ Restart request expired"
        );

        alert(
          "Rematch request expired. Returning to lobby."
        );

        resetToLobby();

        break;

      // =====================================================
      // OPPONENT LEFT
      // =====================================================

      case "opponent_left":

        alert(
          "Opponent left the game."
        );

        resetToLobby();

        break;

      // =====================================================
      // ERROR
      // =====================================================

      case "error":

        alert(
          lastMessage.message
        );

        break;

      // =====================================================
      // UNKNOWN MESSAGE
      // =====================================================

      default:

        console.log(
          "Unknown message:",
          lastMessage
        );
    }
  }, [lastMessage]);

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
    if (
      !playerName.trim() ||
      !roomId.trim()
    ) {
      alert(
        "Enter your name and room ID"
      );

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
  // HANDLE BOARD CLICK
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
    if (!winner || !gameStarted) {
      return;
    }

    async function saveGame() {
      try {
        const winnerId =
          winner === "X"
            ? player1Id
            : player2Id;

        await api.post(
          "/games",
          {
            player1_id: player1Id,
            player2_id: player2Id,
            winner_id: winnerId,
          }
        );

        setRefresh(
          (prev) => prev + 1
        );

        alert(
          "Game Saved!"
        );

      } catch (err) {

        console.log(
          "Error saving game:",
          err
        );
      }
    }

    saveGame();

  }, [
    winner,
    gameStarted,
    player1Id,
    player2Id,
  ]);

  // ---------------------------------------------------------
  // RESET GAME
  // ---------------------------------------------------------

  /*
   * This is intentionally NOT used for the
   * multiplayer rematch.
   *
   * Multiplayer restart must go through
   * the WebSocket.
   */

  function resetGame() {
    requestRestart();
  }

  // ---------------------------------------------------------
  // EXIT GAME
  // ---------------------------------------------------------

  function exitGame() {
    if (
      !window.confirm(
        "Are you sure you want to exit?"
      )
    ) {
      return;
    }

    send({
      action: "exit_game",
      room_id: roomId,
    });

    resetToLobby();
  }

  // ---------------------------------------------------------
  // REQUEST RESTART
  // ---------------------------------------------------------

  function requestRestart() {
    if (!roomId) {
      return;
    }

    /*
     * Prevent the same player from
     * sending multiple requests.
     */

    if (restartRequested) {
      return;
    }

    setRestartRequested(true);
    setRestartWaiting(true);

    send({
      action: "restart_request",
      room_id: roomId,
    });
  }

  // ---------------------------------------------------------
  // ACCEPT RESTART
  // ---------------------------------------------------------

  function acceptRestart() {
    if (!roomId) {
      return;
    }

    send({
      action: "restart_accept",
      room_id: roomId,
    });

    setRestartRequester("");
  }

  // ---------------------------------------------------------
  // DECLINE RESTART
  // ---------------------------------------------------------

  function declineRestart() {
    if (!roomId) {
      return;
    }

    send({
      action: "restart_decline",
      room_id: roomId,
    });

    setRestartRequester("");
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
  // GAME BOARD
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

      requestRestart={requestRestart}

      restartRequested={restartRequested}
      restartWaiting={restartWaiting}
      restartRequester={restartRequester}

      acceptRestart={acceptRestart}
      declineRestart={declineRestart}
    />
  );
}

// =========================================================
// CALCULATE WINNER
// =========================================================

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