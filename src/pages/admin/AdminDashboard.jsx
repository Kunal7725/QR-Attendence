import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getData } from '../../utils/storageUtils';
import { getTodayDate, getCurrentTime } from '../../utils/dateUtils';
import { StatCard } from '../../components/ui/Card';
import '../css/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { qrCode, generateQRCode } = useAttendance();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingApprovals: 0,
    todayPresent: 0,
    todayAbsent: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = () => {
    if (!currentUser?.adminId) return;

    const students = getData('students');
    const attendance = getData('attendance');
    const adminStudents = getData('adminStudents');

    // Get students linked to this admin
    const linkedStudentIds = adminStudents[currentUser.adminId] || [];
    const linkedStudents = students.filter(s => linkedStudentIds.includes(s.studentId));

    // Calculate stats
    const totalStudents = linkedStudents.length;
    const activeStudents = linkedStudents.filter(s => s.status === 'Active').length;
    const pendingApprovals = students.filter(s => s.status === 'Pending').length; // All pending students

    // Today's attendance
    const todayDate = getTodayDate();
    const todayAttendance = attendance.filter(a => 
      a.adminId === currentUser.adminId && a.date === todayDate
    );
    const todayPresent = todayAttendance.length;
    const todayAbsent = activeStudents - todayPresent;

    setStats({
      totalStudents,
      activeStudents,
      pendingApprovals,
      todayPresent,
      todayAbsent
    });

    // Recent activity (last 5 attendance records)
    const recentAttendance = attendance
      .filter(a => a.adminId === currentUser.adminId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(a => {
        const student = students.find(s => s.studentId === a.studentId);
        return {
          ...a,
          studentName: student?.name || 'Unknown Student'
        };
      });

    setRecentActivity(recentAttendance);
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const result = generateQRCode(currentUser.adminId);
      if (result.success) {
        console.log('QR Code generated successfully');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {currentUser?.name}!</h1>
        <p className="dashboard-subtitle">
          Here's what's happening with your attendance system today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <StatCard
          icon="👥"
          value={stats.totalStudents}
          label="Total Students"
          variant="primary"
        />
        <StatCard
          icon="✅"
          value={stats.activeStudents}
          label="Active Students"
          variant="success"
        />
        <StatCard
          icon="⏳"
          value={stats.pendingApprovals}
          label="Pending Approvals"
          variant="warning"
        />
        <StatCard
          icon="📊"
          value={`${stats.todayPresent}/${stats.activeStudents}`}
          label="Today's Attendance"
          variant="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/attendance" className="action-card">
          <span className="action-icon">📅</span>
          <div className="action-title">View Attendance</div>
          <div className="action-desc">Check attendance records by date</div>
        </Link>
        
        <Link to="/admin/students" className="action-card">
          <span className="action-icon">👥</span>
          <div className="action-title">Manage Students</div>
          <div className="action-desc">Approve students and view profiles</div>
        </Link>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* QR Code Generation */}
        <div className="qr-section">
          <div className="qr-header">
            <h3 className="qr-title">Today's QR Code</h3>
            <p className="qr-subtitle">Generate QR code for students to scan</p>
          </div>

          <div className="qr-display">
            {qrCode ? (
              <div className="qr-code-container">
                <QRCode 
                  value={JSON.stringify(qrCode)} 
                  size={200}
                  level="M"
                />
                <div className="qr-info">
                  QR Code generated for {qrCode.date}
                </div>
                <div className="qr-expiry">
                  Expires at {qrCode.expiryTime}
                </div>
              </div>
            ) : (
              <div className="qr-placeholder">
                <p>No QR code generated for today</p>
                <p>Click the button below to generate</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerateQR}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? 'Generating...' : 'Generate Today\'s QR Code'}
          </button>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <div className="activity-header">
            <h3 className="activity-title">Recent Activity</h3>
            <Link to="/admin/attendance" className="view-all-btn">
              View All
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <ul className="activity-list">
              {recentActivity.map((activity, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-avatar">
                    {getStudentInitials(activity.studentName)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{activity.studentName}</strong> marked attendance
                    </div>
                    <div className="activity-time">
                      {activity.date} at {activity.timestamp}
                    </div>
                  </div>
                  <span className={`activity-status ${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-text">No recent activity</div>
              <div className="empty-subtext">
                Student attendance will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;