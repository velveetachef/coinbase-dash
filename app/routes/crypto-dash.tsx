import { useState, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { getCryptoData, type CryptoData } from "../lib";
import { CryptoList } from "../components/CryptoList";
import styles from "../styles/crypto-dash.module.css";

export async function loader() {
  try {
    const cryptoData = await getCryptoData();
    return Response.json({ cryptoData });
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return Response.json({ cryptoData: [] });
  }
}

export default function CryptoDash() {
  const { cryptoData } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState("");

  const filteredCryptoData = useMemo(() => {
    if (!filter.trim()) {
      return cryptoData;
    }

    const filterLower = filter.toLowerCase();
    return cryptoData.filter(
      (crypto: CryptoData) =>
        crypto.name.toLowerCase().includes(filterLower) ||
        crypto.symbol.toLowerCase().includes(filterLower)
    );
  }, [cryptoData, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Cryptocurrency Dashboard</h1>

        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Filter by name or symbol (e.g., 'eth' or 'Ethereum')"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        {filteredCryptoData.length === 0 ? (
          <div className={styles.emptyState}>
            {filter.trim()
              ? "No cryptocurrencies match your filter."
              : "No cryptocurrency data available."}
          </div>
        ) : (
          <CryptoList cryptos={filteredCryptoData} />
        )}
      </div>
    </div>
  );
}

