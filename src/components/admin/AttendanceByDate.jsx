import React, { useState } from 'react';
import '../css/admin/AttendanceByDate.css';

const AttendanceByDate = ({ onDateSelect, attendanceData }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleLoad = () => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      onDateSelect(formattedDate);
    }
  };

  return (
    <div className="attendance-by-date">
      <div className="attendance-header">
        <h3 className="attendance-title">Attendance by Date</h3>
      </div>
      
      <div className="date-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
        <button onClick={handleLoad} className="load-btn">
          Load
        </button>
      </div>

      {attendanceData.length > 0 && (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.rollNo}</td>
                <td>{record.status}</td>
                <td>{record.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceByDate;