/**
 * Shared theme utilities for both server-side script and client-side hook
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isValidTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isValidTheme(storedTheme)) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
  return prefersDark ? "dark" : "light";
}

/**
 * Initialize theme on document - used in root.tsx script
 * This prevents FOUC (Flash of Unstyled Content)
 */
export function initializeTheme(): void {
  try {
    const theme = getInitialTheme();
    document.documentElement.setAttribute("data-theme", theme);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Fallback to light theme on error
    document.documentElement.setAttribute("data-theme", "light");
  }
}

