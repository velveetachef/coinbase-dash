import { cryptoNamesBySymbol } from "./constants";
import { CryptoData } from "./types";

export async function getCryptoData(): Promise<CryptoData[]> {
  const [usdRates, btcRates] = await Promise.all([
    fetchExchangeRates("USD"),
    fetchExchangeRates("BTC"),
  ]);

  const cryptoData: CryptoData[] = [];

  for (const [symbol, name] of Object.entries(cryptoNamesBySymbol)) {
    const usdRate = parseFloat(usdRates.data.rates[symbol]);
    const btcRate = parseFloat(btcRates.data.rates[symbol]);

    cryptoData.push({
      symbol,
      name,
      usdRate,
      btcRate,
    });
  }

  return cryptoData;
}

export async function fetchExchangeRates(
  currency: "USD" | "BTC"
): Promise<CoinbaseExchangeRatesResponse> {
  const response = await fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates for ${currency}`);
  }

  return (await response.json()) as CoinbaseExchangeRatesResponse;
}

export interface CoinbaseExchangeRatesResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}

