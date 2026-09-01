import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { getAdminMatchHistory } from "../services/admin";
import { isAuthenticated, logout } from "../services/auth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";


function AdminMatchHistory() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const data = await getAdminMatchHistory();
      setMatches(data);
    } catch (error) {
      console.error(error);
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
            <h2>📜 Match History</h2>
            <button
                className="refresh-btn"
                onClick={fetchMatches}
            >
                🔄 Refresh
            </button>

          </div>
          <p>
            Total Matches: <strong>{matches.length}</strong>
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Match Key</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Winner</th>
              </tr>
            </thead>

            <tbody>
              {matches.length > 0 ? (
                matches.map((match) => (
                  <tr key={match.match_id}>
                    <td>{match.match_id}</td>
                    <td>{match.match_key}</td>
                    <td>{match.player1}</td>
                    <td>{match.player2}</td>
                    <td>{match.winner}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No Match History Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminMatchHistory;