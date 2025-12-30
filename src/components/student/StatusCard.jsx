import React from 'react';
import '../css/student/StatusCard.css';

const StatusCard = ({ status }) => {
  const isActive = status === 'Active';
  
  return (
    <div className={`status-card ${status.toLowerCase()}`}>
      <span className="status-icon">
        {isActive ? '✅' : '⏳'}
      </span>
      <h3 className="status-title">Account Status</h3>
      <p className="status-message">
        {isActive 
          ? 'Your account is active. You can scan QR codes to mark attendance.'
          : 'Your account is pending admin approval. Please wait for activation.'
        }
      </p>
    </div>
  );
};

export default StatusCard;