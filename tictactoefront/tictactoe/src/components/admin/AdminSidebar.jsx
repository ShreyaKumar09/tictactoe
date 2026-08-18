import "./AdminSidebar.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaTrophy,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminSidebar({ onLogout, stats = {} }) {
  return (
    <aside className="admin-sidebar">
      <div>
        <div className="sidebar-logo">
          <h2>🎮 Tic Tac Toe</h2>
          <p>Admin Panel</p>
        </div>

        <div className="sidebar-summary">
          <span>Players: {stats.totalPlayers ?? 0}</span>
          <span>Matches: {stats.gamesPlayed ?? 0}</span>
          <span>Wins: {stats.totalWins ?? 0}</span>
        </div>

        <nav className="sidebar-menu">
          <button className="active">
            <FaTachometerAlt />
            Dashboard
          </button>

          <button disabled>
            <FaUsers />
            Players
          </button>

          <button disabled>
            <FaGamepad />
            Games
          </button>

          <button disabled>
            <FaTrophy />
            Leaderboard
          </button>

          <button disabled>
            <FaChartBar />
            Analytics
          </button>
        </nav>
      </div>

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