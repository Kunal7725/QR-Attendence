import React from 'react';
import '../css/student/AttendanceHistory.css';

const AttendanceHistory = ({ attendanceData }) => {
  return (
    <div className="attendance-history">
      <div className="history-header">
        <h3 className="history-title">Attendance History</h3>
      </div>

      {attendanceData.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Time</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>
                  <span className={`history-status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.timestamp}</td>
                <td>{record.adminName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-history">
          <div className="empty-history-icon">📊</div>
          <div>No attendance records found</div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;