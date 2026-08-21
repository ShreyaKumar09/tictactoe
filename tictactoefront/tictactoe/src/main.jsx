
import { createRoot } from "react-dom/client";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { WebSocketProvider } from "./context/WebSocketContext";

createRoot(document.getElementById("root")).render(
  
    <ThemeProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </ThemeProvider>
  
);