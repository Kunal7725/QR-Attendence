import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getData, updateData } from '../../utils/storageUtils';
import '../css/admin/StudentsPage.css';

const StudentsPage = () => {
  const { currentUser } = useAuth();
  const { approveStudent } = useAttendance();
  const [activeTab, setActiveTab] = useState('pending');
  const [students, setStudents] = useState([]);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadStudents();
  }, [currentUser]);

  const loadStudents = () => {
    const allStudents = getData('students');
    const adminStudents = getData('adminStudents');
    
    // Get students linked to this admin
    const linkedStudentIds = adminStudents[currentUser?.adminId] || [];
    const linked = allStudents.filter(s => linkedStudentIds.includes(s.studentId));
    
    setStudents(allStudents);
    setLinkedStudents(linked);
  };

  const handleApproveStudent = async (studentId) => {
    setLoading(true);
    try {
      const result = approveStudent(studentId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Student approved successfully!' });
        loadStudents(); // Reload data
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve student' });
      console.error('Error approving student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to reject this student?')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = updateData('students', studentId, { status: 'Rejected' });
      if (result) {
        setMessage({ type: 'success', text: 'Student rejected successfully!' });
        loadStudents();
      } else {
        setMessage({ type: 'error', text: 'Failed to reject student' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject student' });
      console.error('Error rejecting student:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filterStudents = (studentList) => {
    if (!searchTerm) return studentList;
    
    return studentList.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const pendingStudents = filterStudents(students.filter(s => s.status === 'Pending'));
  const activeLinkedStudents = filterStudents(linkedStudents.filter(s => s.status === 'Active'));

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="students-page">
      <div className="students-header">
        <h1 className="students-title">Manage Students</h1>
        <p className="students-subtitle">
          Approve new students and manage existing ones
        </p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.type === 'success' ? '✅' : '❌'}</span>
          {message.text}
          <button 
            onClick={clearMessage}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              marginLeft: 'auto',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="students-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals
          {pendingStudents.length > 0 && (
            <span className="tab-badge warning">{pendingStudents.length}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          My Students
          <span className="tab-badge">{activeLinkedStudents.length}</span>
        </button>
      </div>

      {/* Students Section */}
      <div className="students-section">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students by name, email, or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h3 className="section-title">
            {activeTab === 'pending' ? 'Pending Approvals' : 'Active Students'}
          </h3>
          <span className="section-count">
            {activeTab === 'pending' ? pendingStudents.length : activeLinkedStudents.length} students
          </span>
        </div>

        {/* Students Table */}
        {activeTab === 'pending' ? (
          // Pending Students
          pendingStudents.length > 0 ? (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Batch</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">
                          {getStudentInitials(student.name)}
                        </div>
                        <div className="student-details">
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="student-roll">{student.rollNo}</span>
                    </td>
                    <td>
                      <span className="student-batch">{student.batch}</span>
                    </td>
                    <td>{student.mobile}</td>
                    <td>
                      <span className={`student-status ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleApproveStudent(student.studentId)}
                          disabled={loading}
                          className="action-btn approve"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleRejectStudent(student.studentId)}
                          disabled={loading}
                          className="action-btn reject"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">No Pending Approvals</div>
              <div className="empty-message">
                {searchTerm ? 'No students match your search criteria' : 'All students have been processed'}
              </div>
              <div className="empty-submessage">
                New student registrations will appear here for approval
              </div>
            </div>
          )
        ) : (
          // Active Students
          activeLinkedStudents.length > 0 ? (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Batch</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeLinkedStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">
                          {getStudentInitials(student.name)}
                        </div>
                        <div className="student-details">
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="student-roll">{student.rollNo}</span>
                    </td>
                    <td>
                      <span className="student-batch">{student.batch}</span>
                    </td>
                    <td>{student.mobile}</td>
                    <td>
                      <span className={`student-status ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/students/${student.studentId}`}
                          className="action-btn view"
                        >
                          👁️ View Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">No Students Yet</div>
              <div className="empty-message">
                {searchTerm ? 'No students match your search criteria' : 'No students have scanned your QR codes yet'}
              </div>
              <div className="empty-submessage">
                Students will appear here after they scan your QR codes
              </div>
            </div>
          )
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-row">
            <div className="loading-spinner"></div>
            <div>Processing request...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;