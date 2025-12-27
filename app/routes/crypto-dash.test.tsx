import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRemixStub } from "@remix-run/testing";
import cryptoDashRoute, { loader } from "./crypto-dash";
import type { CryptoData } from "~/lib/apis/coinbase/types";
import { getCryptoData } from '~/lib';

// Mock the getCryptoData function
vi.mock("~/lib", () => ({
  getCryptoData: vi.fn(),
}));

describe("crypto-dash route", () => {
  const mockCryptoData: CryptoData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      usdRate: 50000.0,
      btcRate: 1.0,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      usdRate: 3000.0,
      btcRate: 0.06,
    },
    {
      symbol: "LTC",
      name: "Litecoin",
      usdRate: 150.0,
      btcRate: 0.003,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loader", () => {
    it("should return crypto data on success", async () => {
      vi.mocked(getCryptoData).mockResolvedValueOnce(mockCryptoData);

      const response = await loader();
      expect(response).toBeInstanceOf(Response);
      const data = await response.json();
      expect(data.cryptoData).toEqual(mockCryptoData);
    });

    it("should return empty array on error", async () => {
      vi.mocked(getCryptoData).mockRejectedValueOnce(new Error("API Error"));

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const response = await loader();
      const data = await response.json();
      expect(data.cryptoData).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching crypto data:", expect.any(Error))

      consoleSpy.mockRestore();
    });
  });

  describe("CryptoDash component", () => {
    it("should render the dashboard title", async () => {
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      expect(await screen.findByText("Cryptocurrency Dashboard")).toBeInTheDocument();
    });

    it("should render filter input", async () => {
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );
      expect(filterInput).toBeInTheDocument();
    });

    it("should filter cryptocurrencies by name", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );

      await user.type(filterInput, "Bitcoin");

      expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
      expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
      expect(screen.queryByText("Litecoin")).not.toBeInTheDocument();
    });

    it("should filter cryptocurrencies by symbol", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );

      await user.type(filterInput, "ETH");

      expect(await screen.findByText("Ethereum")).toBeInTheDocument();
      expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
      expect(screen.queryByText("Litecoin")).not.toBeInTheDocument();
    });

    it("should be case-insensitive when filtering", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );

      await user.type(filterInput, "eth");

      expect(await screen.findByText("Ethereum")).toBeInTheDocument();
    });

    it("should show all cryptos when filter is cleared", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );

      await user.type(filterInput, "ETH");
      await user.clear(filterInput);

      expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
      expect(await screen.findByText("Ethereum")).toBeInTheDocument();
      expect(await screen.findByText("Litecoin")).toBeInTheDocument();
    });

    it("should show empty state when no cryptos match filter", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const filterInput = await screen.findByPlaceholderText(
        /Filter by name or symbol/i
      );

      await user.type(filterInput, "XYZ");

      expect(
        await screen.findByText("No cryptocurrencies match your filter.")
      ).toBeInTheDocument();
    });

    it("should show empty state when no crypto data available", async () => {
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: [] }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      expect(
        await screen.findByText("No cryptocurrency data available.")
      ).toBeInTheDocument();
    });

    it("should render refresh button", async () => {
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const refreshButton = await screen.findByRole("button", {
        name: /Refresh data/i,
      });
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).toHaveTextContent("Refresh");
    });

    it("should render auto-refresh toggle button", async () => {
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const autoRefreshButton = await screen.findByRole("button", {
        name: /Enable auto-refresh/i,
      });
      expect(autoRefreshButton).toBeInTheDocument();
      expect(autoRefreshButton).toHaveTextContent("Auto-refresh OFF");
    });

    it("should toggle auto-refresh state", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const autoRefreshButton = await screen.findByRole("button", {
        name: /Enable auto-refresh/i,
      });

      await user.click(autoRefreshButton);

      expect(
        await screen.findByRole("button", { name: /Disable auto-refresh/i })
      ).toBeInTheDocument();
      expect(autoRefreshButton).toHaveTextContent("Auto-refresh ON");

      await user.click(autoRefreshButton);

      expect(
        await screen.findByRole("button", { name: /Enable auto-refresh/i })
      ).toBeInTheDocument();
      expect(autoRefreshButton).toHaveTextContent("Auto-refresh OFF");
    });

    it("should call revalidate when refresh button is clicked", async () => {
      const user = userEvent.setup();
      let loaderCallCount = 0;
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => {
            loaderCallCount++;
            return { cryptoData: mockCryptoData };
          },
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      await screen.findByText("Cryptocurrency Dashboard");
      const initialCallCount = loaderCallCount;

      const refreshButton = await screen.findByRole("button", {
        name: /Refresh data/i,
      });

      await user.click(refreshButton);

      await waitFor(() => {
        expect(loaderCallCount).toBeGreaterThan(initialCallCount);
      });
    });

    it("should disable refresh button while refreshing", async () => {
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return { cryptoData: mockCryptoData };
          },
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      const refreshButton = await screen.findByRole("button", {
        name: /Refresh data/i,
      });

      await user.click(refreshButton);

      expect(refreshButton).toBeDisabled();
      expect(await screen.findByText("Refreshing...")).toBeInTheDocument();
    });

    it("should set up auto-refresh interval when enabled", async () => {
      const user = userEvent.setup();
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      await screen.findByText("Cryptocurrency Dashboard");

      // Clear any intervals set up during initial render
      setIntervalSpy.mockClear();

      const autoRefreshButton = await screen.findByRole("button", {
        name: /Enable auto-refresh/i,
      });

      // Enable auto-refresh
      await user.click(autoRefreshButton);

      // Verify interval is set up with 5000ms
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);

      setIntervalSpy.mockRestore();
    });

    it("should clear auto-refresh interval when disabled", async () => {
      const user = userEvent.setup();
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const RemixStub = createRemixStub([
        {
          path: "/crypto-dash",
          Component: cryptoDashRoute,
          loader: async () => ({ cryptoData: mockCryptoData }),
        },
      ]);

      render(<RemixStub initialEntries={["/crypto-dash"]} />);

      await screen.findByText("Cryptocurrency Dashboard");

      // Clear any intervals set up during initial render
      setIntervalSpy.mockClear();
      clearIntervalSpy.mockClear();

      const autoRefreshButton = await screen.findByRole("button", {
        name: /Enable auto-refresh/i,
      });

      // Enable auto-refresh
      await user.click(autoRefreshButton);

      // Verify interval is set up with 5000ms
      const intervalCalls = setIntervalSpy.mock.calls.filter(
        (call) => call[1] === 5000
      );
      expect(intervalCalls.length).toBeGreaterThan(0);
      clearIntervalSpy.mockClear();

      // Disable auto-refresh
      await user.click(autoRefreshButton);

      // Verify interval is cleared
      expect(clearIntervalSpy).toHaveBeenCalled();
      const clearedInterval = clearIntervalSpy.mock.calls[0][0];
      expect(clearedInterval).toBeDefined();

      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });
  });
});

