import React, { useState } from 'react';
import '../css/student/QRScanner.css';

const QRScanner = ({ onScan, disabled }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const startScan = () => {
    setScanning(true);
    setResult(null);
  };

  const stopScan = () => {
    setScanning(false);
  };

  const handleScanResult = (data) => {
    setScanning(false);
    const result = onScan(data);
    setResult(result);
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h3 className="scanner-title">Scan QR Code</h3>
        <p>Point your camera at the QR code to mark attendance</p>
      </div>

      <div className="camera-area">
        {!scanning ? (
          <div className="camera-placeholder">
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
            <div>Camera not started</div>
          </div>
        ) : (
          <div id="qr-reader" style={{ width: '100%' }}></div>
        )}
      </div>

      <div className="scan-controls">
        {!scanning ? (
          <button 
            onClick={startScan}
            disabled={disabled}
            className="scan-btn primary"
          >
            Start Camera
          </button>
        ) : (
          <button onClick={stopScan} className="scan-btn secondary">
            Stop Camera
          </button>
        )}
      </div>

      {result && (
        <div className={`scan-result ${result.success ? 'success' : 'error'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default QRScanner;