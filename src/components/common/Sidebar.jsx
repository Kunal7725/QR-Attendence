import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getData } from '../../utils/storageUtils';
import '../css/common/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Get pending students count for admin
  const getPendingCount = () => {
    if (currentUser?.role !== 'admin') return 0;
    const students = getData('students');
    return students.filter(s => s.status === 'Pending').length;
  };

  const adminMenuItems = [
    {
      section: 'Dashboard',
      items: [
        {
          path: '/admin/dashboard',
          icon: '📊',
          text: 'Dashboard',
          exact: true
        }
      ]
    },
    {
      section: 'Attendance',
      items: [
        {
          path: '/admin/attendance',
          icon: '📅',
          text: 'Attendance Records'
        }
      ]
    },
    {
      section: 'Students',
      items: [
        {
          path: '/admin/students',
          icon: '👥',
          text: 'Manage Students',
          badge: getPendingCount() > 0 ? getPendingCount() : null,
          badgeType: 'warning'
        }
      ]
    }
  ];

  const studentMenuItems = [
    {
      section: 'Dashboard',
      items: [
        {
          path: '/student/dashboard',
          icon: '📊',
          text: 'Dashboard',
          exact: true
        }
      ]
    },
    {
      section: 'Attendance',
      items: [
        {
          path: '/student/scan',
          icon: '📱',
          text: 'Scan QR Code'
        }
      ]
    }
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenuItems : studentMenuItems;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      
      <div className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-menu">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="menu-section">
              <div className="menu-title">{section.section}</div>
              <ul className="menu-items">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="menu-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `menu-link ${isActive ? 'active' : ''}`
                      }
                      onClick={handleLinkClick}
                      end={item.exact}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-text">{item.text}</span>
                      {item.badge && (
                        <span className={`menu-badge ${item.badgeType || ''}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;