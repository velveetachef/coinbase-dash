/**
 * Theme initialization script
 * Runs immediately on page load to prevent FOUC (Flash of Unstyled Content)
 * Must be plain JavaScript (no modules) to run synchronously before React hydrates
 */
(function () {
  try {
    const THEME_STORAGE_KEY = "theme";

    function isValidTheme(value) {
      return value === "light" || value === "dark";
    }

    function getInitialTheme() {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && isValidTheme(storedTheme)) {
        return storedTheme;
      }
      const prefersDark = window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
      return prefersDark ? "dark" : "light";
    }

    const theme = getInitialTheme();
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    // Fallback to light theme on any error
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
