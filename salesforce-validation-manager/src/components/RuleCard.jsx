import "./RuleCard.css";

export default function RuleCard({ rule, isPending, onToggle }) {
  const { Id, ValidationName, Active, Description, ErrorMessage, ErrorDisplayField } = rule;

  return (
    <div className={`rule-card ${isPending ? "pending" : ""} ${Active ? "is-active" : "is-inactive"}`}>
      {/* Status badge + Pending indicator */}
      <div className="card-top">
        <span className={`status-badge ${Active ? "active" : "inactive"}`}>
          {Active ? "Active" : "Inactive"}
        </span>
        {isPending && <span className="pending-badge">Unsaved</span>}
      </div>

      {/* Rule name */}
      <h3 className="rule-name">{ValidationName || "Unnamed Rule"}</h3>

      {/* Description */}
      {Description && (
        <p className="rule-desc">{Description}</p>
      )}

      {/* Meta info */}
      <div className="rule-meta">
        {ErrorDisplayField && (
          <div className="meta-row">
            <span className="meta-label">Field</span>
            <code className="meta-value">{ErrorDisplayField}</code>
          </div>
        )}
        {ErrorMessage && (
          <div className="meta-row">
            <span className="meta-label">Error msg</span>
            <span className="meta-value">{ErrorMessage}</span>
          </div>
        )}
        <div className="meta-row">
          <span className="meta-label">ID</span>
          <code className="meta-value id-value">{Id}</code>
        </div>
      </div>

      {/* Toggle */}
      <div className="card-footer">
        <span className="toggle-label">
          {Active ? "Disable rule" : "Enable rule"}
        </span>
        <button
          className={`toggle-switch ${Active ? "on" : "off"}`}
          onClick={() => onToggle(Id, Active)}
          aria-label={`Toggle ${ValidationName}`}
        >
          <span className="toggle-knob" />
        </button>
      </div>
    </div>
  );
}
