import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getTodayDate } from '../../utils/dateUtils';
import '../css/student/StudentDashboard.css';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { getStudentAttendanceHistory } = useAttendance();
  const [attendanceData, setAttendanceData] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0,
    todayStatus: null,
    todayTime: null,
    recentAttendance: []
  });

  useEffect(() => {
    if (currentUser?.studentId) {
      loadAttendanceData();
    }
  }, [currentUser]);

  const loadAttendanceData = () => {
    const attendanceHistory = getStudentAttendanceHistory(currentUser.studentId);
    
    // Calculate stats
    const totalDays = attendanceHistory.length;
    const presentDays = attendanceHistory.filter(a => a.status === 'Present').length;
    const absentDays = totalDays - presentDays;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Check today's attendance
    const todayDate = getTodayDate();
    const todayRecord = attendanceHistory.find(a => a.date === todayDate);
    
    // Recent attendance (last 5 records)
    const recentAttendance = attendanceHistory.slice(0, 5);

    setAttendanceData({
      totalDays,
      presentDays,
      absentDays,
      percentage,
      todayStatus: todayRecord?.status || null,
      todayTime: todayRecord?.timestamp || null,
      recentAttendance
    });
  };

  const getTodayStatusDisplay = () => {
    if (attendanceData.todayStatus === 'Present') {
      return {
        className: 'present',
        icon: '✅',
        text: 'Present',
        message: `Marked at ${attendanceData.todayTime}`
      };
    } else {
      return {
        className: 'not-marked',
        icon: '⏳',
        text: 'Not Marked',
        message: 'Scan QR code to mark attendance'
      };
    }
  };

  const todayDisplay = getTodayStatusDisplay();

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1 className="student-title">Welcome, {currentUser?.name}!</h1>
        <p className="student-subtitle">
          Track your attendance and stay updated with your progress.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Account Status */}
        <div className={`status-card ${currentUser?.status?.toLowerCase()}`}>
          <span className="status-icon">
            {currentUser?.status === 'Active' ? '✅' : '⏳'}
          </span>
          <h3 className="status-title">Account Status</h3>
          <p className="status-message">
            {currentUser?.status === 'Active' 
              ? 'Your account is active. You can scan QR codes to mark attendance.'
              : 'Your account is pending admin approval. Please wait for activation.'
            }
          </p>
        </div>

        {/* Attendance Summary */}
        <div className="attendance-summary">
          <div className="summary-header">
            <h3 className="summary-title">Attendance Summary</h3>
            <div className="attendance-percentage">{attendanceData.percentage}%</div>
          </div>
          
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value">{attendanceData.totalDays}</div>
              <div className="stat-label">Total Days</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{attendanceData.presentDays}</div>
              <div className="stat-label">Present</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{attendanceData.absentDays}</div>
              <div className="stat-label">Absent</div>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="today-attendance">
          <div className="today-header">
            <h3 className="today-title">Today's Attendance</h3>
            <span className="today-date">{getTodayDate()}</span>
          </div>
          
          <div className={`attendance-status ${todayDisplay.className}`}>
            <span className="status-icon-small">{todayDisplay.icon}</span>
            {todayDisplay.text}
          </div>
          
          {todayDisplay.message && (
            <div className="attendance-time">{todayDisplay.message}</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-student">
        <Link 
          to="/student/scan" 
          className={`action-card-student ${currentUser?.status !== 'Active' ? 'disabled' : ''}`}
        >
          <span className="action-icon-student">📱</span>
          <div className="action-title-student">Scan QR Code</div>
          <div className="action-desc-student">
            {currentUser?.status === 'Active' 
              ? 'Mark your attendance by scanning QR code'
              : 'Available after account approval'
            }
          </div>
        </Link>
      </div>

      {/* Recent Attendance */}
      <div className="recent-attendance">
        <div className="recent-header">
          <h3 className="recent-title">Recent Attendance</h3>
        </div>

        {attendanceData.recentAttendance.length > 0 ? (
          <ul className="attendance-list">
            {attendanceData.recentAttendance.map((record, index) => (
              <li key={index} className="attendance-item">
                <div>
                  <div className="attendance-date">{record.date}</div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                    {record.adminName} - {record.timestamp}
                  </div>
                </div>
                <span className={`attendance-badge ${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-attendance">
            <div className="empty-attendance-icon">📊</div>
            <div className="empty-attendance-text">No attendance records</div>
            <div className="empty-attendance-subtext">
              Your attendance history will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;