import styles from "./RefreshControls.module.css";

interface RefreshControlsProps {
  isRefreshing: boolean;
  autoRefresh: boolean;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
}

export function RefreshControls({
  isRefreshing,
  autoRefresh,
  onRefresh,
  onToggleAutoRefresh,
}: RefreshControlsProps) {
  return (
    <div className={styles.refreshControls}>
      <button
        type="button"
        onClick={onRefresh}
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
        onClick={onToggleAutoRefresh}
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
  );
}

