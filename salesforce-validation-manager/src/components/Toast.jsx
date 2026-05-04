import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "⚠"}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
