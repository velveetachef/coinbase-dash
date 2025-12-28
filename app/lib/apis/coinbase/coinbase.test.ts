import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCryptoData, fetchExchangeRates, CoinbaseExchangeRatesResponse } from "./coinbase";
import { cryptoNamesBySymbol } from "./constants";

// Mock fetch globally
global.fetch = vi.fn();

describe("coinbase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getCryptoData", () => {
    it("should fetch and combine USD and BTC rates", async () => {
      const mockUsdRates: CoinbaseExchangeRatesResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "1",
            ETH: "0.06",
            LTC: "0.001",
            BCH: "0.01",
            ETC: "0.002",
            ZRX: "0.0001",
            USDC: "1",
            BAT: "0.0005",
            ZEC: "0.003",
            XRP: "0.0002"
          },
        },
      };

      const mockBtcRates: CoinbaseExchangeRatesResponse = {
        data: {
          currency: "BTC",
          rates: {
            BTC: "1",
            ETH: "15",
            LTC: "1000",
            BCH: "100",
            ETC: "500",
            ZRX: "10000",
            USDC: "1",
            BAT: "2000",
            ZEC: "300",
            XRP: "5000",
          },
        },
      };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsdRates,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBtcRates,
        });

      const result = await getCryptoData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(Object.keys(cryptoNamesBySymbol).length);

      // Check a specific crypto
      const btc = result.find((crypto) => crypto.symbol === "BTC");
      expect(btc).toBeDefined();
      expect(btc?.name).toBe("Bitcoin");
      expect(btc?.usdRate).toBe(1);
      expect(btc?.btcRate).toBe(1);

      const eth = result.find((crypto) => crypto.symbol === "ETH");
      expect(eth).toBeDefined();
      expect(eth?.name).toBe("Ethereum");
      expect(eth?.usdRate).toBe(0.06);
      expect(eth?.btcRate).toBe(15);
    });

    it("should handle missing rates gracefully", async () => {
      const mockUsdRates = {
        data: {
          currency: "USD",
          rates: {
            BTC: "1",
            ETH: "0.06",
            // Missing other rates
          },
        },
      };

      const mockBtcRates = {
        data: {
          currency: "BTC",
          rates: {
            BTC: "1",
            ETH: "15",
            // Missing other rates
          },
        },
      };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsdRates,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBtcRates,
        });

      const result = await getCryptoData();

      // Should still return data for all cryptos, with NaN for missing rates
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle fetch errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(getCryptoData()).rejects.toThrow("Network error");
    });
  });

  describe("fetchExchangeRates", () => {
    it("should fetch exchange rates for USD", async () => {
      const mockResponse: CoinbaseExchangeRatesResponse = {
        data: {
          currency: "USD",
          rates: {
            BTC: "1",
            ETH: "0.06",
            LTC: "0.001",
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchExchangeRates("USD");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.coinbase.com/v2/exchange-rates?currency=USD"
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.currency).toBe("USD");
    });

    it("should fetch exchange rates for BTC", async () => {
      const mockResponse = {
        data: {
          currency: "BTC",
          rates: {
            USD: "50000",
            ETH: "15",
            LTC: "1000",
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchExchangeRates("BTC");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.currency).toBe("BTC");
    });

    it("should throw an error when fetch fails", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchExchangeRates("USD")).rejects.toThrow(
        "Failed to fetch exchange rates for USD"
      );
    });

    it("should throw an error when network request fails", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchExchangeRates("USD")).rejects.toThrow("Network error");
    });
  });
});

