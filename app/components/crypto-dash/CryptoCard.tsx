import type { CryptoData } from "~/lib/apis/coinbase/types";
import styles from "./CryptoCard.module.css";

interface CryptoCardProps {
  crypto: CryptoData;
}

export function CryptoCard({ crypto }: CryptoCardProps) {
  const formatRate = (rate: number): string => {
    if (rate === 0) return "N/A";
    if (rate < 0.01) return rate.toFixed(8);
    if (rate < 1) return rate.toFixed(4);
    return rate.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{crypto.name}</h2>
        <p className={styles.symbol}>{crypto.symbol}</p>
      </div>
      <div className={styles.rates}>
        <div>
          <span className={styles.rateLabel}>USD Rate: </span>
          <span className={styles.rateValue}>
            ${formatRate(crypto.usdRate)}
          </span>
        </div>
        <div>
          <span className={styles.rateLabel}>BTC Rate: </span>
          <span className={styles.rateValue}>
            {formatRate(crypto.btcRate)} BTC
          </span>
        </div>
      </div>
    </div>
  );
}
