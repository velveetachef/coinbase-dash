import { useTheme } from "../../hooks";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <>
          <span aria-hidden="true">☀️</span>
          Light
        </>
      ) : (
        <>
          <span aria-hidden="true">🌙</span>
          Dark
        </>
      )}
    </button>
  );
}
