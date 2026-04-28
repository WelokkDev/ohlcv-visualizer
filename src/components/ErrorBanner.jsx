export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-message">{message}</span>
      <button type="button" className="error-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
