
import React from "react";

function Square({ value, onClick }) {
  return (
    <button
      className={`square ${
        value === "X"
          ? "square-x"
          : value === "O"
          ? "square-o"
          : ""
      }`}
      onClick={onClick}
      disabled={value !== null}
    >
      {value}
    </button>
  );
}

export default Square;

