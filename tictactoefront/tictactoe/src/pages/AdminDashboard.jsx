import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";
import { clearMatchHistory } from "../services/admin";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import {
  FaUsers,
  FaGamepad,
  FaTrophy,
  FaCircle,
} from "react-icons/fa";
import StatCard from "../components/admin/StatCard";


function AdminDashboard() {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }

  async function handleClearHistory() {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all match history?"
    );

    if (!confirmDelete) return;

    try {
      const response = await clearMatchHistory();

      alert(response.message);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Failed to clear match history.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="admin-layout">
    <AdminSidebar onLogout={handleLogout} />

    <main className="admin-content">
      <AdminNavbar />

      <div className="stats-grid">
        <StatCard
        icon={<FaUsers />}
        title="Total Players"
         value="--"
          />
          <StatCard
          icon={<FaGamepad />}
          title="Games Played"
           value="--"
           />
           <StatCard
            icon={<FaTrophy />}
            title="Total Wins"
             value="--"
             />
             <StatCard
              icon={<FaCircle />}
              title="Active Rooms"
              value="--"
               />
               </div>

      <div className="admin-action-card">
        <h2>🗑 Clear Match History</h2>
        <p>
          Delete all stored match history from the database.This action cannot be undone.

        </p>

      <button
        className="start-btn"
        onClick={handleClearHistory}
      >
        🗑 Clear Match History
      </button>
      </div>
      </main>
        

      
    </div>
  );
}

export default AdminDashboard;