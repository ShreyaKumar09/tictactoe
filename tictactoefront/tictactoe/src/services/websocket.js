let socket = null;

export function connect(onMessage) {
  // Prevent opening multiple connections
  if (socket) return;

  socket = new WebSocket("wss://tictactoe-q6bb.onrender.com/ws");

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Disconnected");
    socket = null;
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
}

export function send(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket is not connected.");
  }
}

export function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
}