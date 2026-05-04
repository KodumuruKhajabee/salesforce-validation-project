import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { getTokenFromUrl, saveToken, getToken, clearToken } from "./services/auth";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);
  const [instanceUrl, setInstanceUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if callback from Salesforce OAuth
    const urlToken = getTokenFromUrl();
    if (urlToken) {
      saveToken(urlToken.access_token, urlToken.instance_url);
      setToken(urlToken.access_token);
      setInstanceUrl(urlToken.instance_url);
      window.history.replaceState({}, document.title, "/");
    } else {
      // Check localStorage
      const saved = getToken();
      if (saved) {
        setToken(saved.access_token);
        setInstanceUrl(saved.instance_url);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setInstanceUrl(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Connecting...</p>
      </div>
    );
  }

  return token ? (
    <DashboardPage token={token} instanceUrl={instanceUrl} onLogout={handleLogout} />
  ) : (
    <LoginPage />
  );
}
