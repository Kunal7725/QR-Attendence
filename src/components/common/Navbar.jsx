import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../css/common/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-logo">
          QR
        </div>
        <span className="brand-text">QR Attendance System</span>
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(currentUser?.name)}
          </div>
          <div className="user-details">
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-role">{currentUser?.role}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;