import React from "react";
import "./NotificationModal.css";

const NotificationModal = ({ title = "Vaccination Reminder", messages = [], onClose, onSnooze }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="notif-overlay" role="dialog" aria-modal="true">
      <div className="notif-modal">
        <div className="notif-header">
          <h2>{title}</h2>
          <button className="notif-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="notif-body">
          <p style={{ color: "#555" }}>The following vaccinations need attention:</p>
          <ul className="notif-list">
            {messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
        <div className="notif-actions">
          {onSnooze && (
            <button className="notif-secondary" onClick={onSnooze}>Remind me later today</button>
          )}
          <button className="notif-ok" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
