import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import api from "../services/api";
import { isAuthenticated, logout } from "../services/auth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

function AdminGames() {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const response = await api.get("/match-history");
      setGames(response.data);
    } catch (error) {
      console.error("Failed to load games:", error);
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
            <h2>🎮 Match History</h2>

            <button
              className="refresh-btn"
              onClick={loadGames}
            >
              🔄 Refresh
            </button>
          </div>

          <p>
            Total Games: <strong>{games.length}</strong>
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Winner</th>
              </tr>
            </thead>

            <tbody>
              {games.length > 0 ? (
                games.map((game, index) => (
                  <tr key={game.id}>
                    <td>{index + 1}</td>
                    <td>{game.player1}</td>
                    <td>{game.player2}</td>
                    <td>{game.winner}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No games found.
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

export default AdminGames;