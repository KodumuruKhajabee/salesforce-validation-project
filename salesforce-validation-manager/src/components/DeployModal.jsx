import "./DeployModal.css";

export default function DeployModal({ rules, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🚀</div>
        <h2>Deploy Changes to Salesforce</h2>
        <p className="modal-subtitle">
          The following <strong>{rules.length}</strong> rule(s) will be updated in your Salesforce org:
        </p>

        <div className="modal-rules-list">
          {rules.map((r) => (
            <div key={r.Id} className="modal-rule">
              <span className={`modal-rule-status ${r.Active ? "active" : "inactive"}`}>
                {r.Active ? "→ Activate" : "→ Deactivate"}
              </span>
              <span className="modal-rule-name">{r.ValidationName}</span>
            </div>
          ))}
        </div>

        <p className="modal-warning">
          ⚠️ This will make live changes to your Salesforce org. Make sure you're using a <strong>Dev/Sandbox</strong> environment.
        </p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm &amp; Deploy
          </button>
        </div>
      </div>
    </div>
  );
}
