import React from 'react';
import '../css/admin/StudentProfile.css';

const StudentProfile = ({ student, attendanceStats }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(student.name)}
        </div>
        <div className="profile-details">
          <h2 className="profile-name">{student.name}</h2>
          <div className="profile-meta">
            Roll: {student.rollNo} | Batch: {student.batch} | {student.email}
          </div>
        </div>
      </div>

      <div className="attendance-summary">
        <div className="summary-item">
          <div className="summary-value">{attendanceStats.totalDays}</div>
          <div className="summary-label">Total Days</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{attendanceStats.presentDays}</div>
          <div className="summary-label">Present</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{attendanceStats.absentDays}</div>
          <div className="summary-label">Absent</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{attendanceStats.percentage}%</div>
          <div className="summary-label">Attendance</div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;