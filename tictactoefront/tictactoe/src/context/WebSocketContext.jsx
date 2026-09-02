import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://tictactoe-q6bb.onrender.com/ws");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩", data);
      setLastMessage(data);
    };

    socket.onclose = (event) => {
      console.log(
        "❌ WebSocket Closed",
        "Code:",
        event.code,
        "Reason:",
        event.reason
      );
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    return () => {
      const currentSocket = socketRef.current;

      if (currentSocket && (currentSocket.readyState === WebSocket.CONNECTING || currentSocket.readyState === WebSocket.OPEN)
      ) { currentSocket.close(1000, "Component unmounted");}

      socketRef.current = null;
      setLastMessage(null);
    };
  }, []);

  function clearLastMessage() {
    setLastMessage(null);
  }

  function send(data) {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ Socket not connected");
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage,
        clearLastMessage,
        send,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}