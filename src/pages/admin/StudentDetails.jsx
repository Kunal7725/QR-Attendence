import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getData } from '../../utils/storageUtils';
import '../css/admin/StudentDetails.css';

const StudentDetails = () => {
  const { studentId } = useParams();
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [studentId, currentUser]);

  const loadStudentData = () => {
    setLoading(true);
    try {
      // Get student details
      const students = getData('students');
      const studentData = students.find(s => s.studentId === studentId);
      
      if (!studentData) {
        console.error('Student not found');
        setLoading(false);
        return;
      }

      // Get attendance history for this student under current admin
      const attendance = getData('attendance');
      const studentAttendance = attendance
        .filter(a => a.studentId === studentId && a.adminId === currentUser?.adminId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Calculate stats
      const totalDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
      const absentDays = totalDays - presentDays;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      setStudent(studentData);
      setAttendanceHistory(studentAttendance);
      setStats({ totalDays, presentDays, absentDays, percentage });
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="student-details-page">
        <div className="loading-details">
          <div className="loading-spinner-details"></div>
          <div>Loading student details...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-details-page">
        <Link to="/admin/students" className="back-button">
          ← Back to Students
        </Link>
        <div className="empty-history">
          <div className="empty-history-icon">❌</div>
          <div className="empty-history-text">Student Not Found</div>
          <div className="empty-history-subtext">
            The requested student could not be found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-details-page">
      <Link to="/admin/students" className="back-button">
        ← Back to Students
      </Link>

      {/* Student Profile Card */}
      <div className="student-profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {getStudentInitials(student.name)}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{student.name}</h1>
            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-icon">📧</span>
                {student.email}
              </div>
              <div className="meta-item">
                <span className="meta-icon">📱</span>
                {student.mobile}
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎓</span>
                {student.batch} Batch
              </div>
            </div>
            <span className={`profile-status ${student.status.toLowerCase()}`}>
              {student.status}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <div className="detail-label">Student ID</div>
            <div className="detail-value">{student.studentId}</div>
          </div>
          <div className="detail-group">
            <div className="detail-label">Roll Number</div>
            <div className="detail-value">{student.rollNo}</div>
          </div>
          <div className="detail-group">
            <div className="detail-label">Batch</div>
            <div className="detail-value">{student.batch}</div>
          </div>
          <div className="detail-group">
            <div className="detail-label">Registration Date</div>
            <div className="detail-value">
              {new Date(student.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="attendance-stats-card">
        <div className="stats-header">
          <h2 className="stats-title">Attendance Statistics</h2>
          <p className="stats-subtitle">
            Overall attendance performance under your coaching
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-box total">
            <span className="stat-icon">📊</span>
            <div className="stat-number">{stats.totalDays}</div>
            <div className="stat-label">Total Days</div>
          </div>
          <div className="stat-box present">
            <span className="stat-icon">✅</span>
            <div className="stat-number">{stats.presentDays}</div>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat-box absent">
            <span className="stat-icon">❌</span>
            <div className="stat-number">{stats.absentDays}</div>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat-box percentage">
            <span className="stat-icon">📈</span>
            <div className="stat-number">{stats.percentage}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="attendance-history-card">
        <div className="history-header">
          <h3 className="history-title">Attendance History</h3>
        </div>

        {attendanceHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((record, index) => (
                <tr key={index}>
                  <td>
                    <span className="history-date">{record.date}</span>
                  </td>
                  <td>
                    <span className={`history-status ${record.status.toLowerCase()}`}>
                      {record.status === 'Present' ? '✓' : '✗'} {record.status}
                    </span>
                  </td>
                  <td>{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-history">
            <div className="empty-history-icon">📊</div>
            <div className="empty-history-text">No Attendance Records</div>
            <div className="empty-history-subtext">
              This student hasn't marked any attendance under your coaching yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;