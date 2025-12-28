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
  const renderRefreshButton = () => {
    if (isRefreshing) {
      return (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          Refreshing...
        </>
      );
    }
    return (
      <>
        <span aria-hidden="true">↻</span>
        Refresh
      </>
    );
  };

  const renderAutoRefreshButton = () => {
    if (autoRefresh) {
      return (
        <>
          <span aria-hidden="true">⏸</span>
          Disable Auto-Refresh
        </>
      );
    }
    return (
      <>
        <span aria-hidden="true">▶</span>
        Enable Auto-Refresh
      </>
    );
  };

  return (
    <div className={styles.refreshControls}>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className={styles.refreshButton}
        aria-label="Refresh data"
      >
        {renderRefreshButton()}
      </button>
      <button
        type="button"
        onClick={onToggleAutoRefresh}
        className={`${styles.autoRefreshButton} ${
          autoRefresh ? styles.active : ""
        }`}
        aria-label={
          autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"
        }
      >
        {renderAutoRefreshButton()}
      </button>
    </div>
  );
}
