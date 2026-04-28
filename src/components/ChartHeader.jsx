function formatRange(firstTime, lastTime) {
  const fmt = (s) =>
    new Date(s * 1000).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  return `${fmt(firstTime)}  →  ${fmt(lastTime)}`;
}

export default function ChartHeader({ meta, onReset }) {
  return (
    <header className="chart-header">
      <div className="chart-header-info">
        <span className="chart-header-name">{meta.fileName}</span>
        <span className="chart-header-meta">
          {meta.rowCount.toLocaleString()} bars · {formatRange(meta.firstTime, meta.lastTime)}
        </span>
      </div>
      <button type="button" className="chart-header-reset" onClick={onReset}>
        Load another
      </button>
    </header>
  );
}
