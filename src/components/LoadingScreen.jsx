export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="loading">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-label">{label}</p>
    </div>
  );
}
