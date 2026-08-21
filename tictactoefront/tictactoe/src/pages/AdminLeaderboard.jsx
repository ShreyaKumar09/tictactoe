import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import api from "../services/api";
import { isAuthenticated, logout } from "../services/auth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

function AdminLeaderboard() {
  const navigate = useNavigate();

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      const response = await api.get("/leaderboard");
      setLeaders(response.data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />

      <main className="admin-content">
        <AdminNavbar />

        <div className="admin-action-card">
          <div className="admin-page-header">
            <h2>🏆 Leaderboard</h2>

            <button
              className="refresh-btn"
              onClick={loadLeaderboard}
            >
              🔄 Refresh
            </button>
          </div>

          <p>
            Ranked Players: <strong>{leaders.length}</strong>
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
              </tr>
            </thead>

            <tbody>
              {leaders.length > 0 ? (
                leaders.map((player, index) => (
                  <tr key={player.name}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.wins}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No leaderboard data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminLeaderboard;