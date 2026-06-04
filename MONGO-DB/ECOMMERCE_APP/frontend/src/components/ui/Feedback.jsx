export const Spinner = ({ size = "md" }) => (
  <div className={`spinner spinner-${size}`} aria-label="Loading..." />
);

export const ErrorMessage = ({ message }) => (
  <div className="error-box" role="alert">
    ⚠️ {message || "Something went wrong. Please try again."}
  </div>
);

export const EmptyState = ({ icon = "📭", title, subtitle }) => (
  <div className="empty-state">
    <span className="empty-icon">{icon}</span>
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
  </div>
);