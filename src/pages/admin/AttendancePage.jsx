import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getTodayDate, formatDate } from '../../utils/dateUtils';
import '../css/admin/AttendancePage.css';

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const { getAttendanceByDate } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    if (currentUser?.adminId) {
      loadAttendanceData();
    }
  }, [currentUser, selectedDate]);

  const loadAttendanceData = () => {
    if (!currentUser?.adminId) return;
    
    setLoading(true);
    try {
      const data = getAttendanceByDate(currentUser.adminId, selectedDate);
      setAttendanceData(data);
      
      // Calculate stats
      const total = data.length;
      const present = data.filter(d => d.status === 'Present').length;
      const absent = total - present;
      
      setStats({ total, present, absent });
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    setSelectedDate(formattedDate);
  };

  const handleTodayClick = () => {
    setSelectedDate(getTodayDate());
  };

  const getDateInputValue = () => {
    // Convert DD/MM/YYYY to YYYY-MM-DD for input
    const [day, month, year] = selectedDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const getStudentInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const exportToCSV = () => {
    if (attendanceData.length === 0) return;
    
    const headers = ['Student Name', 'Roll No', 'Status', 'Time'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(row => [
        `"${row.name}"`,
        row.rollNo,
        row.status,
        row.timestamp
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate.replace(/\//g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance Records</h1>
        <p className="attendance-subtitle">
          View and manage student attendance by date
        </p>
      </div>

      {/* Date Selection Controls */}
      <div className="attendance-controls">
        <div className="controls-header">
          <h3 className="controls-title">Select Date</h3>
          <p className="controls-subtitle">Choose a date to view attendance records</p>
        </div>
        
        <div className="date-selector">
          <input
            type="date"
            value={getDateInputValue()}
            onChange={handleDateChange}
            className="date-input"
          />
          <button 
            onClick={loadAttendanceData}
            disabled={loading}
            className="load-btn"
          >
            📊 Load Attendance
          </button>
          <button 
            onClick={handleTodayClick}
            className="today-btn"
          >
            📅 Today
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="attendance-summary">
        <div className="summary-card total">
          <span className="summary-icon">👥</span>
          <div className="summary-value">{stats.total}</div>
          <div className="summary-label">Total Students</div>
        </div>
        
        <div className="summary-card present">
          <span className="summary-icon">✅</span>
          <div className="summary-value">{stats.present}</div>
          <div className="summary-label">Present</div>
        </div>
        
        <div className="summary-card absent">
          <span className="summary-icon">❌</span>
          <div className="summary-value">{stats.absent}</div>
          <div className="summary-label">Absent</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        <div className="table-header">
          <h3 className="table-title">Attendance Details</h3>
          <span className="selected-date">📅 {selectedDate}</span>
        </div>

        {loading ? (
          <div className="loading-attendance">
            <div className="loading-spinner-attendance"></div>
            <div>Loading attendance data...</div>
          </div>
        ) : attendanceData.length > 0 ? (
          <>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <div className="student-info-attendance">
                        <div className="student-avatar-attendance">
                          {getStudentInitials(record.name)}
                        </div>
                        <div className="student-details-attendance">
                          <div className="student-name-attendance">{record.name}</div>
                          <div className="student-roll-attendance">Roll: {record.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td>{record.rollNo}</td>
                    <td>
                      <span className={`attendance-status-badge ${record.status.toLowerCase()}`}>
                        {record.status === 'Present' ? '✓' : '✗'} {record.status}
                      </span>
                    </td>
                    <td>
                      <span className={`attendance-time ${record.status.toLowerCase()}`}>
                        {record.timestamp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Export Actions */}
            <div className="export-actions">
              <button onClick={exportToCSV} className="export-btn">
                📄 Export CSV
              </button>
            </div>
          </>
        ) : (
          <div className="empty-attendance">
            <div className="empty-attendance-icon">📊</div>
            <div className="empty-attendance-title">No Attendance Records</div>
            <div className="empty-attendance-message">
              No students have marked attendance for {selectedDate}
            </div>
            <div className="empty-attendance-submessage">
              Generate a QR code and ask students to scan it to mark attendance
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;