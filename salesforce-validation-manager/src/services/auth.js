// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Replace with your Connected App values from Salesforce Setup
const SF_CONFIG = {
  clientId: import.meta.env.VITE_SF_CLIENT_ID || "YOUR_CONNECTED_APP_CLIENT_ID",
  redirectUri: import.meta.env.VITE_SF_REDIRECT_URI || "http://localhost:5173",
  loginUrl: import.meta.env.VITE_SF_LOGIN_URL || "https://login.salesforce.com",
};

// ─── OAUTH LOGIN ──────────────────────────────────────────────────────────────
export function loginWithSalesforce() {
  const params = new URLSearchParams({
    response_type: "token",          // Implicit flow (no backend needed)
    client_id: SF_CONFIG.clientId,
    redirect_uri: SF_CONFIG.redirectUri,
    scope: "api",
  });
  window.location.href = `${SF_CONFIG.loginUrl}/services/oauth2/authorize?${params}`;
}

// ─── PARSE TOKEN FROM URL (after OAuth callback) ──────────────────────────────
export function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const instance_url = decodeURIComponent(params.get("instance_url") || "");

  if (!access_token) return null;
  return { access_token, instance_url };
}

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
export function saveToken(access_token, instance_url) {
  localStorage.setItem("sf_token", JSON.stringify({ access_token, instance_url }));
}

export function getToken() {
  try {
    return JSON.parse(localStorage.getItem("sf_token"));
  } catch {
    return null;
  }
}

export function clearToken() {
  localStorage.removeItem("sf_token");
}
