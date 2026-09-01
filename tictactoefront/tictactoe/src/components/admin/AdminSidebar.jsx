import "./AdminSidebar.css";

import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaTrophy,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h2>🎮 Tic Tac Toe</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-menu">

        <button
          className={location.pathname === "/admin-dashboard" ? "active" : ""}
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaTachometerAlt />
          Dashboard
        </button>

        <button
          className={location.pathname === "/admin/players" ? "active" : ""}
          onClick={() => navigate("/admin/players")}
        >
          <FaUsers />
          Players
        </button>

        <button
          className={location.pathname === "/admin/games" ? "active" : ""}
          onClick={() => navigate("/admin/games")}
        >
          <FaGamepad />
          Games
        </button>

        <button
          className={location.pathname === "/admin/match-history" ? "active" : ""}
          onClick={() => navigate("/admin/match-history")}
        >
          <FaChartBar />
          Match History
        </button>

        <button
          className={location.pathname === "/admin/leaderboard" ? "active" : ""}
          onClick={() => navigate("/admin/leaderboard")}
        >
          <FaTrophy />
          Leaderboard
        </button>

      </nav>

      <button
        className="logout-btn"
        onClick={onLogout}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;