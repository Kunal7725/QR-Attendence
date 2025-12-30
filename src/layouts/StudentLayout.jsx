import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import './css/StudentLayout.css';

const StudentLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="student-layout">
      <Navbar onMenuToggle={toggleSidebar} />
      
      <div className="student-content">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="student-main">
          {/* Show status alert if student is pending */}
          {currentUser?.status === 'Pending' && (
            <div className="status-alert pending">
              <span className="status-icon">⏳</span>
              <div className="status-message">
                Your account is pending admin approval. You cannot scan QR codes until approved.
              </div>
            </div>
          )}
          
          {currentUser?.status === 'Active' && (
            <div className="status-alert active">
              <span className="status-icon">✅</span>
              <div className="status-message">
                Your account is active. You can now scan QR codes to mark attendance.
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;