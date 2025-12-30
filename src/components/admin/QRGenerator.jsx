import React from 'react';
import QRCode from 'react-qr-code';
import '../css/admin/QRGenerator.css';

const QRGenerator = ({ qrCode, onGenerate, loading }) => {
  return (
    <div className="qr-generator">
      <div className="qr-header">
        <h3 className="qr-title">Today's QR Code</h3>
        <p className="qr-subtitle">Generate QR code for students to scan</p>
      </div>

      <div className="qr-display">
        {qrCode ? (
          <div className="qr-code-container">
            <QRCode value={JSON.stringify(qrCode)} size={200} />
            <div className="qr-info">
              QR Code generated for {qrCode.date}
            </div>
          </div>
        ) : (
          <p>No QR code generated for today</p>
        )}
      </div>

      <button 
        onClick={onGenerate}
        disabled={loading}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>
    </div>
  );
};

export default QRGenerator;