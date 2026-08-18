import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import Lobby from "../components/Lobby";
import GameBoard from "../components/GameBoard";
import { useWebSocket } from "../context/WebSocketContext";
import Toast from "../components/Toast";
import ExitModal from "../components/ExitModal";
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
  const saveAttemptKeyRef = useRef("");

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
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const completedMatchKeyRef = useRef("");

  // ---------------------------------------------------------
  // RESTART STATE
  // ---------------------------------------------------------

  const [restartRequested, setRestartRequested] = useState(false);
  const [restartWaiting, setRestartWaiting] = useState(false);
  const [restartRequester, setRestartRequester] = useState("");

  const { send, lastMessage } = useWebSocket();

  const winner = calculateWinner(board);


  // ---------------------------------------------------------
  // TOAST STATE
  // ---------------------------------------------------------

  const [toast, setToast] = useState({
    message: "",
    type: "info",
  });


  // ---------------------------------------------------------
  // TOAST HANDLER
  // ---------------------------------------------------------

  function showToast(message, type = "info") {
    setToast({ message, type });
  }

  // ---------------------------------------------------------
  // CLOSE TOAST
  // ---------------------------------------------------------

  function closeToast() {
    setToast({ message: "", type: "info" });
  }

  // ---------------------------------------------------------
  // RESET TO LOBBY
  // ---------------------------------------------------------

  function resetToLobby() {
    setBoard(Array(9).fill(null));
    setXTurn(true);
    setGameStarted(false);
    setShowExitModal(false);
    setShowResultModal(false);
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
    saveAttemptKeyRef.current = "";
    completedMatchKeyRef.current = "";
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

        setShowResultModal(false);
        setRestartRequested(false);
        setRestartWaiting(false);

        const requesterName =
          lastMessage.requester_name ||
          (playerName === player1Name
            ? player2Name
            : player1Name);

        setRestartRequester(
          requesterName || "Opponent"
        );

        break;

      // =====================================================
      // RESTART GAME
      // =====================================================

      case "restart_game":

        console.log(
          "🔄 Restarting game"
        );

        setShowResultModal(false);
        setBoard(Array(9).fill(null));
        setXTurn(lastMessage.turn === "X");
        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");
        saveAttemptKeyRef.current = "";
        completedMatchKeyRef.current = "";

        break;

      // =====================================================
      // RESTART DECLINED
      // =====================================================

      case "restart_declined":

        setShowResultModal(false);
        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");
        saveAttemptKeyRef.current = "";
        completedMatchKeyRef.current = "";

        showToast(
          "Opponent declined the restart request.",
          "info"
        );

        resetToLobby();

        break;

      // =====================================================
      // RESTART CANCELLED
      // =====================================================

      case "restart_cancelled":

        setShowResultModal(false);
        setRestartRequested(false);
        setRestartWaiting(false);
        setRestartRequester("");
        saveAttemptKeyRef.current = "";
        completedMatchKeyRef.current = "";

        showToast(
          "Opponent cancelled the restart request.",
          "info"
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

        showToast(
          "Restart request expired. Returning to lobby.",
          "info"
        );

        resetToLobby();

        break;

      // =====================================================
      // OPPONENT LEFT
      // =====================================================

      case "opponent_left":

        showToast(
          "Opponent left the game.",
          "info"
        );

        resetToLobby();

        break;

      // =====================================================
      // ERROR
      // =====================================================

      case "error":

        showToast(
          lastMessage.message,
          "error"
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
  // PLAYER RECORDS
  // ---------------------------------------------------------

  async function ensurePlayerExists(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const response = await api.post("/players", {
      name: trimmedName,
    });

    return response.data.player.id;
  }

  // ---------------------------------------------------------
  // CREATE ROOM
  // ---------------------------------------------------------

  async function createRoom() {
    if (!playerName.trim()) {
      showToast("Enter your name", "error");
      return;
    }

    try {
      const playerId = await ensurePlayerExists(playerName);

      if (!playerId) {
        showToast("Unable to create player record.", "error");
        return;
      }

      setIsHost(true);
      setPlayer1Id(playerId);
      setPlayer2Id(null);

      send({
        action: "create_room",
        player_name: playerName,
        player_id: playerId,
      });
    } catch (error) {
      console.error(error);
      showToast("Unable to create player record.", "error");
    }
  }

  // ---------------------------------------------------------
  // JOIN ROOM
  // ---------------------------------------------------------

  async function joinRoom() {
    if (
      !playerName.trim() ||
      !roomId.trim()
    ) {
      showToast("Enter your name and room ID", "error");

      return;
    }

    try {
      const playerId = await ensurePlayerExists(playerName);

      if (!playerId) {
        showToast("Unable to create player record.", "error");
        return;
      }

      setIsHost(false);
      setPlayer1Id(null);
      setPlayer2Id(playerId);

      send({
        action: "join_room",
        room_id: roomId,
        player_name: playerName,
        player_id: playerId,
      });
    } catch (error) {
      console.error(error);
      showToast("Unable to join room.", "error");
    }
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
    const hasGameResult = Boolean(winner) || (!winner && board.every(Boolean));

    if (!gameStarted || !hasGameResult) {
      setShowResultModal(false);
      return;
    }

    const resultKey = `${roomId}-${winner || "draw"}-${player1Id ?? "n"}-${player2Id ?? "n"}-${board.join("")}`;

    if (completedMatchKeyRef.current === resultKey) {
      setShowResultModal(true);
      return;
    }

    completedMatchKeyRef.current = resultKey;
    saveAttemptKeyRef.current = resultKey;
    setShowResultModal(true);

    if (!isHost) {
      return;
    }

    async function saveGame() {
      try {
        const finalWinnerId =
          winner === "X"
            ? player1Id
            : winner === "O"
              ? player2Id
              : null;

        if (!player1Id || !player2Id) {
          return;
        }

        await api.post("/games", {
          match_key: resultKey,
          player1_id: player1Id,
          player2_id: player2Id,
          winner_id: finalWinnerId,
        });

        setRefresh((prev) => prev + 1);
        showToast(
          winner
            ? `Game saved! Winner: ${winner}`
            : "Game saved! Result: Draw",
          "success"
        );
      } catch (err) {
        console.log("Error saving game:", err);
        saveAttemptKeyRef.current = "";
        completedMatchKeyRef.current = "";
      }
    }

    saveGame();
  }, [
    winner,
    board,
    gameStarted,
    player1Id,
    player2Id,
    roomId,
    isHost,
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
    setShowExitModal(true);
  }
    
      
      
    
  function confirmExitGame() {
    send({
      action: "exit_game",
      room_id: roomId,
    });
    setShowExitModal(false);

    resetToLobby();
  }
  function cancelExitGame() {
  setShowExitModal(false);
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
      action: "decline_restart",
      room_id: roomId,
    });

    setRestartRequester("");
  }

  // ---------------------------------------------------------
  // LOBBY
  // ---------------------------------------------------------

  if (!gameStarted) {
    return (
      <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}    
      />
      <Lobby
        playerName={playerName}
        setPlayerName={setPlayerName}
        roomId={roomId}
        setRoomId={setRoomId}
        createRoom={createRoom}
        joinRoom={joinRoom}
        refresh={refresh}
        isHost={isHost}
      />
      </>
    );
  }

  // ---------------------------------------------------------
  // GAME BOARD
  // ---------------------------------------------------------

  return (
    <>
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={closeToast}    
    />

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
      showResultModal={showResultModal}
      setShowResultModal={setShowResultModal}
    />

    <ExitModal
      open={showExitModal}
      onConfirm={confirmExitGame}
      onCancel={cancelExitGame}
    />
    </>
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