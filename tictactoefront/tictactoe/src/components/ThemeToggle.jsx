import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
  className="theme-toggle"
  onClick={toggleTheme}
  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
>
  {theme === "dark" ? "☀️" : "🌙"}
</button>
  );
}

