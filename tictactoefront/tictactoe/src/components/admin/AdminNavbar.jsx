import "./AdminNavbar.css";
import { FaUserShield } from "react-icons/fa";

function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <div>
        <h1>Dashboard</h1>
        <p>Manage your Tic Tac Toe application</p>
      </div>

      <div className="admin-profile">
        <FaUserShield />
        <span>Admin</span>
      </div>
    </header>
  );
}

export default AdminNavbar;