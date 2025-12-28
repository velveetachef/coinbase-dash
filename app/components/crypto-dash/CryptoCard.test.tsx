import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CryptoCard } from "./CryptoCard";
import type { CryptoData } from "~/lib/apis/coinbase/types";

describe("CryptoCard", () => {
  const mockCrypto: CryptoData = {
    symbol: "BTC",
    name: "Bitcoin",
    usdRate: 50000.0,
    btcRate: 1.0,
  };

  it("should render cryptocurrency name and symbol", () => {
    render(<CryptoCard crypto={mockCrypto} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
  });

  it("should render USD rate", () => {
    render(<CryptoCard crypto={mockCrypto} />);

    expect(screen.getByText(/USD Rate:/)).toBeInTheDocument();
    expect(screen.getByText(/\$50,000\.00/)).toBeInTheDocument();
  });

  it("should render BTC rate", () => {
    render(<CryptoCard crypto={mockCrypto} />);

    expect(screen.getByText(/BTC Rate:/)).toBeInTheDocument();
    expect(screen.getByText(/1\.00 BTC/)).toBeInTheDocument();
  });

  it("should format small rates correctly (less than 0.01)", () => {
    const smallRateCrypto: CryptoData = {
      symbol: "XRP",
      name: "XRP",
      usdRate: 0.005,
      btcRate: 0.0000001,
    };

    render(<CryptoCard crypto={smallRateCrypto} />);

    expect(screen.getByText(/\$0\.00500000/)).toBeInTheDocument();
    expect(screen.getByText(/0\.00000010 BTC/)).toBeInTheDocument();
  });

  it("should format medium rates correctly (between 0.01 and 1)", () => {
    const mediumRateCrypto: CryptoData = {
      symbol: "ETH",
      name: "Ethereum",
      usdRate: 0.5,
      btcRate: 0.06,
    };

    render(<CryptoCard crypto={mediumRateCrypto} />);

    expect(screen.getByText(/\$0\.5000/)).toBeInTheDocument();
    expect(screen.getByText(/0\.0600 BTC/)).toBeInTheDocument();
  });

  it("should display N/A for zero rates", () => {
    const zeroRateCrypto: CryptoData = {
      symbol: "TEST",
      name: "Test Coin",
      usdRate: 0,
      btcRate: 0,
    };

    render(<CryptoCard crypto={zeroRateCrypto} />);

    // Both rates are 0, so N/A appears twice (once in USD rate, once in BTC rate)
    // Use regex to match text containing N/A since it's part of larger strings
    const naElements = screen.getAllByText(/N\/A/);
    expect(naElements.length).toBeGreaterThanOrEqual(2);

    // Verify USD rate shows N/A
    expect(screen.getByText(/\$.*N\/A/)).toBeInTheDocument();
    // Verify BTC rate shows N/A
    expect(screen.getByText(/N\/A.*BTC/)).toBeInTheDocument();
  });

  it("should format large numbers with commas", () => {
    const largeRateCrypto: CryptoData = {
      symbol: "BTC",
      name: "Bitcoin",
      usdRate: 1234567.89,
      btcRate: 1.0,
    };

    render(<CryptoCard crypto={largeRateCrypto} />);

    expect(screen.getByText(/\$1,234,567\.89/)).toBeInTheDocument();
  });
});

