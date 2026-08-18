import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaUsers, FaGamepad, FaTrophy, FaCircle } from "react-icons/fa";

import { isAuthenticated, logout } from "../services/auth";
import { clearMatchHistory } from "../services/admin";
import api from "../services/api";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import StatCard from "../components/admin/StatCard";
import ConfirmModal from "../components/admin/ConfirmModal";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    gamesPlayed: 0,
    totalWins: 0,
    activeRooms: 0,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const [playersRes, historyRes, leaderboardRes] = await Promise.all([
        api.get("/players", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/match-history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const totalWins = leaderboardRes.data.reduce(
        (sum, row) => sum + Number(row.wins || 0),
        0
      );

      setStats({
        totalPlayers: playersRes.data.length,
        gamesPlayed: historyRes.data.length,
        totalWins,
        activeRooms: 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }

  async function handleClearHistory() {
    try {
      const response = await clearMatchHistory();
      setConfirmOpen(false);
      await fetchDashboardStats();
      console.log(response.message);
    } catch (error) {
      console.error(error);
      setConfirmOpen(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} stats={stats} />

      <main className="admin-content">
        <AdminNavbar />

        <div className="stats-grid">
          <StatCard icon={<FaUsers />} title="Total Players" value={stats.totalPlayers} />
          <StatCard icon={<FaGamepad />} title="Games Played" value={stats.gamesPlayed} />
          <StatCard icon={<FaTrophy />} title="Total Wins" value={stats.totalWins} />
          <StatCard icon={<FaCircle />} title="Active Rooms" value={stats.activeRooms} />
        </div>

        <div className="admin-action-card">
          <h2>🗑 Clear Match History</h2>
          <p>
            Delete all stored match history from the database. This action cannot be undone.
          </p>

          <button className="start-btn" onClick={() => setConfirmOpen(true)}>
            🗑 Clear Match History
          </button>
        </div>
      </main>

      <ConfirmModal
        open={confirmOpen}
        title="Clear Match History"
        message="Are you sure you want to delete all game records? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default AdminDashboard;