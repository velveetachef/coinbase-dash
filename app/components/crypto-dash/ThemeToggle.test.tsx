import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Reset theme to light mode before each test
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem("theme");
  });

  it("should render theme toggle button", () => {
    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to (dark|light) mode/i,
    });
    expect(themeToggle).toBeInTheDocument();
  });

  it("should show Dark button text when theme is light", () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");

    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to dark mode/i,
    });
    expect(themeToggle).toHaveTextContent("Dark");
  });

  it("should show Light button text when theme is dark", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");

    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to light mode/i,
    });
    expect(themeToggle).toHaveTextContent("Light");
  });

  it("should toggle theme when button is clicked", async () => {
    const user = userEvent.setup();
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");

    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to dark mode/i,
    });

    expect(themeToggle).toHaveTextContent("Dark");

    await user.click(themeToggle);

    // Verify theme changed to dark
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /Switch to light mode/i })
    ).toBeInTheDocument();
    expect(themeToggle).toHaveTextContent("Light");

    // Toggle back to light
    await user.click(themeToggle);

    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(
      screen.getByRole("button", { name: /Switch to dark mode/i })
    ).toBeInTheDocument();
    expect(themeToggle).toHaveTextContent("Dark");
  });

  it("should initialize theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");

    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to light mode/i,
    });
    expect(themeToggle).toHaveTextContent("Light");
  });

  it("should default to light theme when localStorage is empty", () => {
    localStorage.removeItem("theme");
    document.documentElement.removeAttribute("data-theme");

    render(<ThemeToggle />);

    const themeToggle = screen.getByRole("button", {
      name: /Switch to dark mode/i,
    });
    expect(themeToggle).toHaveTextContent("Dark");
  });
});

