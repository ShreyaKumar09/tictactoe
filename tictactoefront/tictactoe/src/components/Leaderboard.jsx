
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaCrown, FaMedal } from "react-icons/fa";

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

  function getMedal(index) {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return <FaMedal color="#94a3b8" />;
    }
  }

  return (
    <div className="leaderboard">

      {leaders.length === 0 ? (
        <p className="empty-message">No players yet.</p>
      ) : (
        leaders.map((player, index) => (
          <div
            key={index}
            className={`leader-card ${
              index < 3 ? "top-player" : ""
            }`}
          >
            <div className="leader-left">
              <span className="leader-rank">
                {getMedal(index)}
              </span>

              <div>
                <div className="leader-name">
                  {player.name}
                </div>

                <div className="leader-score">
                  {player.wins} Wins
                </div>
              </div>
            </div>

            {index === 0 && (
              <FaCrown className="crown-icon" />
            )}
          </div>
        ))
      )}

    </div>
  );
}

export default Leaderboard;
