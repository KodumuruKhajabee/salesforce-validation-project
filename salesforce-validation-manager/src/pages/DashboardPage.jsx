import { useState, useEffect, useCallback } from "react";
import { fetchValidationRules, deployRules, getUserInfo } from "../services/salesforce";
import RuleCard from "../components/RuleCard";
import DeployModal from "../components/DeployModal";
import Toast from "../components/Toast";
import "./DashboardPage.css";

export default function DashboardPage({ token, instanceUrl, onLogout }) {
  const [rules, setRules] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({}); // {ruleId: true/false}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployResults, setDeployResults] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | inactive

  // ── LOAD RULES ──────────────────────────────────────────────────────────────
  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchValidationRules(instanceUrl, token);
      setRules(data);
      setPendingChanges({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [instanceUrl, token]);

  useEffect(() => {
    loadRules();
    getUserInfo(instanceUrl, token).then(setUser).catch(() => {});
  }, [loadRules]);

  // ── TOGGLE A RULE (local state only) ────────────────────────────────────────
  const handleToggle = (ruleId, currentActive) => {
    const originalRule = rules.find((r) => r.Id === ruleId);
    const originalActive = originalRule?.Active;
    const newActive = !currentActive;

    // Update display
    setRules((prev) =>
      prev.map((r) => (r.Id === ruleId ? { ...r, Active: newActive } : r))
    );

    // Track if changed from original
    setPendingChanges((prev) => {
      const updated = { ...prev };
      if (newActive === originalActive) {
        delete updated[ruleId]; // reverted to original
      } else {
        updated[ruleId] = newActive;
      }
      return updated;
    });
  };

  // ── DEPLOY CHANGES ──────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    setDeploying(true);
    setShowDeployModal(false);

    const changedRules = rules.filter((r) => r.Id in pendingChanges);

    try {
      const results = await deployRules(instanceUrl, token, changedRules);
      setDeployResults(results);

      const failed = results.filter((r) => !r.success);
      if (failed.length === 0) {
        setToast({ type: "success", message: `${results.length} rule(s) deployed successfully!` });
        setPendingChanges({});
      } else {
        setToast({ type: "error", message: `${failed.length} rule(s) failed to deploy.` });
      }
    } catch (err) {
      setToast({ type: "error", message: "Deploy failed: " + err.message });
    } finally {
      setDeploying(false);
    }
  };

  // ── FILTER RULES ─────────────────────────────────────────────────────────────
  const filteredRules = rules.filter((r) => {
    if (filter === "active") return r.Active;
    if (filter === "inactive") return !r.Active;
    return true;
  });

  const changedCount = Object.keys(pendingChanges).length;
  const activeCount = rules.filter((r) => r.Active).length;

  return (
    <div className="dashboard">
      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="10" fill="#00A1E0" />
              <path d="M24 10C17.4 10 12 15.4 12 22c0 3.6 1.6 6.8 4.1 9H31.9C34.4 28.8 36 25.6 36 22c0-6.6-5.4-12-12-12z" fill="white" opacity="0.9"/>
              <path d="M16 29c0 5 3.6 9 8 9s8-4 8-9H16z" fill="white" opacity="0.7"/>
            </svg>
            <div>
              <h2>Validation Manager</h2>
              {user && <span className="dash-org">{user.organization_id || "Salesforce Org"}</span>}
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          {user && <span className="dash-user">{user.name || user.email}</span>}
          <button className="btn-outline" onClick={loadRules} disabled={loading}>
            {loading ? "Loading…" : "⟳ Refresh"}
          </button>
          <button className="btn-danger" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{rules.length}</span>
          <span className="stat-label">Total Rules</span>
        </div>
        <div className="stat">
          <span className="stat-value active">{activeCount}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value inactive">{rules.length - activeCount}</span>
          <span className="stat-label">Inactive</span>
        </div>
        <div className="stat">
          <span className="stat-value pending">{changedCount}</span>
          <span className="stat-label">Pending Changes</span>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="controls-bar">
        <div className="filter-tabs">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="btn-deploy"
          disabled={changedCount === 0 || deploying}
          onClick={() => setShowDeployModal(true)}
        >
          {deploying ? (
            <>
              <span className="mini-spinner" />
              Deploying...
            </>
          ) : (
            <>
              🚀 Deploy Changes {changedCount > 0 && `(${changedCount})`}
            </>
          )}
        </button>
      </div>

      {/* ── CONTENT ── */}
      <main className="dash-main">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching validation rules from Salesforce...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span>⚠️</span>
            <div>
              <strong>Failed to load rules</strong>
              <p>{error}</p>
              <button className="btn-outline" onClick={loadRules}>Try Again</button>
            </div>
          </div>
        )}

        {!loading && !error && filteredRules.length === 0 && (
          <div className="empty-state">
            <span>📋</span>
            <p>
              {rules.length === 0
                ? "No validation rules found on the Account object."
                : `No ${filter} rules found.`}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="rules-grid">
            {filteredRules.map((rule) => (
              <RuleCard
                key={rule.Id}
                rule={rule}
                isPending={rule.Id in pendingChanges}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── MODALS & TOASTS ── */}
      {showDeployModal && (
        <DeployModal
          rules={rules.filter((r) => r.Id in pendingChanges)}
          onConfirm={handleDeploy}
          onCancel={() => setShowDeployModal(false)}
        />
      )}

      {deployResults && (
        <div className="deploy-results">
          <h4>Last Deploy Results</h4>
          {deployResults.map((r) => (
            <div key={r.id} className={`deploy-result ${r.success ? "ok" : "fail"}`}>
              {r.success ? "✓" : "✗"} {r.name}
              {!r.success && <span className="err-msg">{r.error}</span>}
            </div>
          ))}
          <button className="close-results" onClick={() => setDeployResults(null)}>✕</button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
