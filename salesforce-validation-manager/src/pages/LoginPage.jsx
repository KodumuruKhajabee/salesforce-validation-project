import { loginWithSalesforce } from "../services/auth";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#00A1E0" />
            <path d="M24 10C17.4 10 12 15.4 12 22c0 3.6 1.6 6.8 4.1 9H31.9C34.4 28.8 36 25.6 36 22c0-6.6-5.4-12-12-12z" fill="white" opacity="0.9"/>
            <path d="M16 29c0 5 3.6 9 8 9s8-4 8-9H16z" fill="white" opacity="0.7"/>
          </svg>
          <span>Validation Manager</span>
        </div>

        <h1>Salesforce Validation Rules</h1>
        <p className="login-subtitle">
          Connect your Salesforce org to manage, toggle, and deploy validation rules on the Account object.
        </p>

        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <div>
              <strong>Fetch Rules</strong>
              <span>View all Account validation rules</span>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">🔁</span>
            <div>
              <strong>Toggle Active/Inactive</strong>
              <span>Enable or disable rules instantly</span>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <div>
              <strong>Deploy Changes</strong>
              <span>Push updates back to Salesforce</span>
            </div>
          </div>
        </div>

        <button className="login-btn" onClick={loginWithSalesforce}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
          </svg>
          Login with Salesforce
        </button>

        <p className="login-note">
          Uses OAuth 2.0 — your credentials are never stored by this app.
        </p>
      </div>
    </div>
  );
}
