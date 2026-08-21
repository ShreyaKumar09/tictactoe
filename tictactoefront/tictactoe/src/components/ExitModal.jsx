import React from "react";

function ExitModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="exit-modal">

        <h2>Exit Game</h2>

        <p>
          Are you sure you want to exit the game?
        </p>

        <div className="exit-modal-buttons">

          <button
            className="exit-btn"
            onClick={onConfirm}
          >
            Exit
          </button>

          <button
            className="restart-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}

export default ExitModal;
