import "./App.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlayers from "./pages/AdminPlayers";
import AdminGames from "./pages/AdminGames";
import AdminLeaderboard from "./pages/AdminLeaderboard";

import { useWebSocket } from "./context/WebSocketContext";

function AppShell() {
  const location = useLocation();
  const { clearLastMessage } = useWebSocket();

  useEffect(() => {
    clearLastMessage();
  }, [location.pathname, clearLastMessage]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} 
      />
      <Route
      path="/admin/players"
      element={<AdminPlayers />}
      />
      <Route
      path="/admin/games"
      element={<AdminGames />}
      />
      <Route
      path="/admin/leaderboard"
      element={<AdminLeaderboard />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;