import { useState, useMemo, useEffect } from "react";
import { useLoaderData, useRevalidator } from "@remix-run/react";
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

type LoaderData = {
  cryptoData: CryptoData[];
};

export default function CryptoDash() {
  const revalidator = useRevalidator();
  const { cryptoData } = useLoaderData<LoaderData>();
  const [filter, setFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const isRefreshing = revalidator.state === "loading";

  // Auto-refresh interval (5 seconds)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      revalidator.revalidate(); // re-run the loader function
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, revalidator]);

  const handleManualRefresh = () => {
    revalidator.revalidate();
  };

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
        <div className={styles.header}>
          <h1 className={styles.title}>Cryptocurrency Dashboard</h1>
          <div className={styles.refreshControls}>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={styles.refreshButton}
              aria-label="Refresh data"
            >
              {isRefreshing ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Refreshing...
                </>
              ) : (
                <>
                  <span aria-hidden="true">↻</span>
                  Refresh
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`${styles.autoRefreshButton} ${
                autoRefresh ? styles.active : ""
              }`}
              aria-label={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
            >
              {autoRefresh ? (
                <>
                  <span aria-hidden="true">⏸</span>
                  Auto-refresh ON
                </>
              ) : (
                <>
                  <span aria-hidden="true">▶</span>
                  Auto-refresh OFF
                </>
              )}
            </button>
          </div>
        </div>

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

