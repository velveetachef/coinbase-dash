import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefreshControls } from "./RefreshControls";

describe("RefreshControls", () => {
  const mockOnRefresh = vi.fn();
  const mockOnToggleAutoRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render refresh button", () => {
    render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const refreshButton = screen.getByRole("button", {
      name: /Refresh data/i,
    });
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveTextContent("Refresh");
    expect(refreshButton).not.toBeDisabled();
  });

  it("should render auto-refresh toggle button", () => {
    render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const autoRefreshButton = screen.getByRole("button", {
      name: /Enable auto-refresh/i,
    });
    expect(autoRefreshButton).toBeInTheDocument();
    expect(autoRefreshButton).toHaveTextContent("Enable Auto-Refresh");
  });

  it("should call onRefresh when refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const refreshButton = screen.getByRole("button", {
      name: /Refresh data/i,
    });

    await user.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it("should call onToggleAutoRefresh when auto-refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const autoRefreshButton = screen.getByRole("button", {
      name: /Enable auto-refresh/i,
    });

    await user.click(autoRefreshButton);

    expect(mockOnToggleAutoRefresh).toHaveBeenCalledTimes(1);
  });

  it("should disable refresh button when isRefreshing is true", () => {
    render(
      <RefreshControls
        isRefreshing={true}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const refreshButton = screen.getByRole("button", {
      name: /Refresh data/i,
    });
    expect(refreshButton).toBeDisabled();
    expect(refreshButton).toHaveTextContent("Refreshing...");
  });

  it("should show spinner when refreshing", () => {
    render(
      <RefreshControls
        isRefreshing={true}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const spinner = screen.getByText("Refreshing...");
    expect(spinner).toBeInTheDocument();
  });

  it("should show Disable Auto-Refresh state when autoRefresh is true", () => {
    render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={true}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    const autoRefreshButton = screen.getByRole("button", {
      name: /Disable auto-refresh/i,
    });
    expect(autoRefreshButton).toBeInTheDocument();
    expect(autoRefreshButton).toHaveTextContent("Disable Auto-Refresh");
  });

  it("should toggle auto-refresh button state", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={false}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    let autoRefreshButton = screen.getByRole("button", {
      name: /Enable auto-refresh/i,
    });
    expect(autoRefreshButton).toHaveTextContent("Enable Auto-Refresh");

    // Simulate toggle
    await user.click(autoRefreshButton);
    expect(mockOnToggleAutoRefresh).toHaveBeenCalledTimes(1);

    // Rerender with autoRefresh true
    rerender(
      <RefreshControls
        isRefreshing={false}
        autoRefresh={true}
        onRefresh={mockOnRefresh}
        onToggleAutoRefresh={mockOnToggleAutoRefresh}
      />
    );

    autoRefreshButton = screen.getByRole("button", {
      name: /Disable auto-refresh/i,
    });
    expect(autoRefreshButton).toHaveTextContent("Disable Auto-Refresh");
  });
});

