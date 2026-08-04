import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";
import { clearMatchHistory } from "../services/admin";

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
    <div className="container">
      <h1>Admin Dashboard</h1>

      <p>Welcome Admin 👋</p>

      <button
        className="start-btn"
        onClick={handleClearHistory}
      >
        🗑 Clear Match History
      </button>

      <br />
      <br />

      <button
        className="start-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;