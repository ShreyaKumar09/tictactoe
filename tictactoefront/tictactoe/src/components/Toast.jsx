import React, { useEffect } from "react";

function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "info" && "ⓘ"}
          {type === "warning" && "⚠"}
        </span>

        <span className="toast-message">
          {message}
        </span>

        <button
          className="toast-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;