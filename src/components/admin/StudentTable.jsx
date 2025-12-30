import React from 'react';
import '../css/admin/StudentTable.css';

const StudentTable = ({ students, onApprove, onReject }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="student-table-container">
      <div className="table-header">
        <h3 className="table-title">Student Management</h3>
      </div>
      
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Batch</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td>
                <div className="student-info">
                  <div className="student-avatar">
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <div>{student.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {student.email}
                    </div>
                  </div>
                </div>
              </td>
              <td>{student.rollNo}</td>
              <td>{student.batch}</td>
              <td>{student.status}</td>
              <td>
                {student.status === 'Pending' && (
                  <>
                    <button 
                      className="action-btn approve"
                      onClick={() => onApprove(student.studentId)}
                    >
                      Approve
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => onReject(student.studentId)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;