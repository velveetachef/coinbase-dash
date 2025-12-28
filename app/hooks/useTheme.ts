import { useState, useEffect, useCallback } from "react";
import { getInitialTheme, THEME_STORAGE_KEY, type Theme } from "../lib/utils/theme-utils";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Sync theme to DOM attribute and localStorage
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const newTheme: Theme = currentTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
}


