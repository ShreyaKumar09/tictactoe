import React, { useEffect, useState } from "react";
import api from "../api";

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
      <h2>📜 Match History</h2>

      {games.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Winner</th>
            </tr>
          </thead>

          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.player1}</td>
                <td>{game.player2}</td>
                <td>{game.winner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MatchHistory;