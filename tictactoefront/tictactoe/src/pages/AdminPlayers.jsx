import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import api from "../services/api";
import { isAuthenticated, logout } from "../services/auth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

function AdminPlayers() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const response = await api.get("/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Failed to load players:", error);
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
            <h2>👥 Registered Players</h2>

            <button
              className="refresh-btn"
              onClick={loadPlayers}
            >
              🔄 Refresh
            </button>
          </div>

          <p>
            Total Players: <strong>{players.length}</strong>
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Player Name</th>
              </tr>
            </thead>

            <tbody>
              {players.length > 0 ? (
                players.map((player, index) => (
                  <tr key={player.id}>
                    <td>{index + 1}</td>
                    <td>{player.id}</td>
                    <td>{player.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center" }}
                  >
                    No players found.
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

export default AdminPlayers;