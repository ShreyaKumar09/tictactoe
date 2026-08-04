import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await login(
        username,
        password
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      alert("Login Successful!");

      navigate("/admin-dashboard");
    } catch (err) {
      alert("Invalid Username or Password");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>Admin Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />

        <button
          className="start-btn"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;