import React, { useEffect, useState } from "react";
import api from "../api";

function Leaderboard({ refresh }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [refresh]);

  async function fetchLeaderboard() {
    try {
      const response = await api.get("/leaderboard");
      setLeaders(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>

      {leaders.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <ol>
          {leaders.map((player) => (
            <li key={player.name}>
              {player.name} - {player.wins} wins
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;