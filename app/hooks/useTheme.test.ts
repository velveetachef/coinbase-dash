import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  const originalMatchMedia = window.matchMedia;
  const mockMatchMedia = vi.fn();

  const createMockMediaQueryList = (matches: boolean): MediaQueryList => ({
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset document attribute
    document.documentElement.removeAttribute("data-theme");
    // Mock matchMedia
    window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;
    mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  it("should initialize with light theme when no localStorage value exists", () => {
    mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should initialize with dark theme from localStorage", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should initialize with light theme from localStorage", () => {
    localStorage.setItem("theme", "light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should initialize with dark theme from system preference when no localStorage value", () => {
    mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should prioritize localStorage over system preference", () => {
    localStorage.setItem("theme", "light");
    mockMatchMedia.mockReturnValue(createMockMediaQueryList(true));

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should handle invalid localStorage values gracefully", () => {
    localStorage.setItem("theme", "invalid-theme");
    mockMatchMedia.mockReturnValue(createMockMediaQueryList(false));

    const { result } = renderHook(() => useTheme());

    // Should fall back to system preference (light in this case)
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should toggle from light to dark", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("should toggle from dark to light", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should update DOM attribute when theme changes", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should persist theme to localStorage on toggle", () => {
    localStorage.clear();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem("theme")).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should maintain toggleTheme function reference stability", () => {
    const { result, rerender } = renderHook(() => useTheme());
    const firstToggle = result.current.toggleTheme;

    rerender();

    // Function should be stable due to useCallback
    expect(result.current.toggleTheme).toBe(firstToggle);
  });

  it("should handle multiple toggles correctly", () => {
    const { result } = renderHook(() => useTheme());

    // Toggle multiple times
    act(() => {
      result.current.toggleTheme(); // light -> dark
    });
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme(); // dark -> light
    });
    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme(); // light -> dark
    });
    expect(result.current.theme).toBe("dark");
  });
});

