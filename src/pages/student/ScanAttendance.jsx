import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getTodayDate } from '../../utils/dateUtils';
import '../css/student/ScanAttendance.css';

const ScanAttendance = () => {
  const { currentUser } = useAuth();
  const { markAttendance, getStudentAttendanceHistory } = useAttendance();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    loadRecentScans();
    
    // Cleanup scanner on unmount
    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(console.error);
      }
    };
  }, [currentUser]);

  const loadRecentScans = () => {
    if (currentUser?.studentId) {
      const history = getStudentAttendanceHistory(currentUser.studentId);
      setRecentScans(history.slice(0, 3)); // Show last 3 scans
    }
  };

  const startScanning = () => {
    if (currentUser?.status !== 'Active') {
      setResult({
        type: 'error',
        message: 'Your account is pending admin approval. Cannot scan QR codes.'
      });
      return;
    }

    setScanning(true);
    setResult(null);

    // Initialize the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
  };

  const stopScanning = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().then(() => {
        setScanning(false);
        console.log('Scanner stopped successfully');
      }).catch(err => {
        console.error('Error stopping scanner:', err);
        setScanning(false);
      });
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);
    
    // Stop scanning immediately after successful scan
    stopScanning();
    
    // Process the scanned QR code
    processQRCode(decodedText);
  };

  const onScanError = (error) => {
    // Don't log every scan error, it's too noisy
    // console.warn('QR scan error:', error);
  };

  const processQRCode = async (qrData) => {
    try {
      const result = markAttendance(currentUser.studentId, qrData);
      
      if (result.success) {
        setResult({
          type: 'success',
          message: result.message
        });
        
        // Reload recent scans to show the new entry
        setTimeout(() => {
          loadRecentScans();
        }, 1000);
      } else {
        setResult({
          type: 'error',
          message: result.error
        });
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setResult({
        type: 'error',
        message: 'Failed to process QR code. Please try again.'
      });
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <div className="scan-attendance">
      <div className="scan-header">
        <h1 className="scan-title">Scan QR Code</h1>
        <p className="scan-subtitle">
          Point your camera at the QR code to mark attendance
        </p>
      </div>

      <div className="scanner-card">
        {/* Instructions */}
        <div className="scanner-instructions">
          <div className="instructions-title">
            📋 How to scan:
          </div>
          <ul className="instructions-list">
            <li>Click "Start Camera" button below</li>
            <li>Point your camera at the QR code displayed by your teacher</li>
            <li>Keep the QR code within the scanning area</li>
            <li>Wait for automatic detection and attendance marking</li>
          </ul>
        </div>

        {/* Scanner Area */}
        <div className="scanner-area">
          <div className="camera-preview" style={{ position: 'relative' }}>
            {!scanning ? (
              <div className="camera-placeholder">
                <span className="camera-icon">📷</span>
                <div className="placeholder-text">Camera not started</div>
                <div className="placeholder-subtext">
                  Click "Start Camera" to begin scanning
                </div>
              </div>
            ) : (
              <div id="qr-reader" style={{ width: '100%' }}></div>
            )}
            
            {/* Disabled overlay for pending students */}
            {currentUser?.status !== 'Active' && (
              <div className="disabled-overlay">
                <div className="disabled-message">
                  <div className="disabled-icon">⏳</div>
                  <div className="disabled-text">Account Pending Approval</div>
                  <div className="disabled-subtext">
                    Please wait for admin approval to scan QR codes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scanner Controls */}
        <div className="scanner-controls">
          {!scanning ? (
            <button 
              onClick={startScanning}
              className="scan-btn primary"
              disabled={currentUser?.status !== 'Active'}
            >
              📷 Start Camera
            </button>
          ) : (
            <button 
              onClick={stopScanning}
              className="scan-btn secondary"
            >
              ⏹️ Stop Camera
            </button>
          )}
        </div>

        {/* Scan Result */}
        {result && (
          <div className={`scan-result ${result.type}`}>
            <span className="result-icon">
              {result.type === 'success' ? '✅' : '❌'}
            </span>
            <div className="result-message">{result.message}</div>
            <button 
              onClick={clearResult}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="scan-history">
            <h3 className="history-title">Recent Attendance</h3>
            <ul className="history-list">
              {recentScans.map((scan, index) => (
                <li key={index} className="history-item">
                  <div>
                    <div className="history-date">{scan.date}</div>
                    <div className="history-time">
                      {scan.timestamp} - {scan.adminName}
                    </div>
                  </div>
                  <span className="history-status">{scan.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanAttendance;