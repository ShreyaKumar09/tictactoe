
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrophy, FaTimes } from "react-icons/fa";

function MatchHistory({ refresh }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, [refresh]);

  async function fetchGames() {
    try {
      const response = await api.get("/match-history");
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }

  return (
    <div className="history">

      {games.length === 0 ? (
        <p className="empty-message">No games played yet.</p>
      ) : (
        games.map((game) => (
          <div
            className="match-card"
            key={game.id}
          >

            <div className="players-row">

              <div className="player-box">
                <strong>{game.player1}</strong>
                <span>X</span>
              </div>

              <div className="vs">
                <FaTimes />
              </div>

              <div className="player-box">
                <strong>{game.player2}</strong>
                <span>O</span>
              </div>

            </div>

            <div className="winner-row">
              <FaTrophy />
              Winner:
              <strong>{game.winner}</strong>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default MatchHistory;
