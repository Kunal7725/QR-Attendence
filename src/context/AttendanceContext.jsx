import React, { createContext, useContext, useState } from 'react';
import { getData, saveData, addData, updateData } from '../utils/storageUtils';
import { getTodayDate, getCurrentTime, isExpired } from '../utils/dateUtils';
import { isValidQRData } from '../utils/validationUtils';
//global store
const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [qrCode, setQrCode] = useState(null);

  // Generate QR code for admin
  const generateQRCode = (adminId) => {
    try {
      const qrData = {
        adminId,
        date: getTodayDate(),
        expiryTime: '23:59' // Expires at end of day
      };
      
      setQrCode(qrData);
      console.log('QR Code generated:', qrData);
      return { success: true, qrData };
    } catch (error) {
      console.error('Error generating QR code:', error);
      return { success: false, error: error.message };
    }
  };

  // Mark attendance when student scans QR
  const markAttendance = (studentId, qrDataString) => {
    try {
      // Validate QR data format
      if (!isValidQRData(qrDataString)) {
        throw new Error('Invalid QR code format');
      }

      const qrData = JSON.parse(qrDataString);
      const { adminId, date, expiryTime } = qrData;

      // Check if QR is expired
      if (isExpired(expiryTime)) {
        throw new Error('QR code has expired');
      }

      // Check if student is active
      const students = getData('students');
      const student = students.find(s => s.studentId === studentId);
      if (!student) {
        throw new Error('Student not found');
      }
      if (student.status !== 'Active') {
        throw new Error('Your account is pending admin approval');
      }

      // Check if already marked today
      const attendance = getData('attendance');
      const todayAttendance = attendance.find(a => 
        a.studentId === studentId && 
        a.adminId === adminId && 
        a.date === date
      );
      
      if (todayAttendance) {
        throw new Error('Attendance already marked for today');
      }

      // Create attendance record
      const attendanceRecord = {
        studentId,
        adminId,
        date,
        status: 'Present',
        timestamp: getCurrentTime(),
        createdAt: new Date().toISOString()
      };

      addData('attendance', attendanceRecord);

      // Link student to admin
      const adminStudents = getData('adminStudents') || {};
      if (!adminStudents[adminId]) {
        adminStudents[adminId] = [];
      }
      if (!adminStudents[adminId].includes(studentId)) {
        adminStudents[adminId].push(studentId);
        saveData('adminStudents', adminStudents);
      }

      console.log('Attendance marked successfully:', attendanceRecord);
      return { success: true, message: 'Attendance marked successfully! ✅' };
    } catch (error) {
      console.error('Error marking attendance:', error);
      return { success: false, error: error.message };
    }
  };

  // Get attendance by date for admin
  const getAttendanceByDate = (adminId, selectedDate) => {
    try {
      const attendance = getData('attendance');
      const students = getData('students');
      const adminStudents = getData('adminStudents');

      // Get students linked to this admin
      const linkedStudentIds = adminStudents[adminId] || [];
      
      // Get attendance for selected date
      const dateAttendance = attendance.filter(a => 
        a.adminId === adminId && a.date === selectedDate
      );

      // Create attendance list with all linked students
      const attendanceList = linkedStudentIds.map(studentId => {
        const student = students.find(s => s.studentId === studentId);
        const attendanceRecord = dateAttendance.find(a => a.studentId === studentId);
        
        return {
          studentId,
          name: student?.name || 'Unknown',
          rollNo: student?.rollNo || 'N/A',
          status: attendanceRecord ? attendanceRecord.status : 'Absent',
          timestamp: attendanceRecord ? attendanceRecord.timestamp : '-'
        };
      });

      return attendanceList;
    } catch (error) {
      console.error('Error getting attendance by date:', error);
      return [];
    }
  };

  // Get student's attendance history
  const getStudentAttendanceHistory = (studentId) => {
    try {
      const attendance = getData('attendance');
      const admins = getData('admins');
      
      const studentAttendance = attendance
        .filter(a => a.studentId === studentId)
        .map(a => {
          const admin = admins.find(admin => admin.adminId === a.adminId);
          return {
            ...a,
            adminName: admin?.name || 'Unknown Admin',
            coachingName: admin?.coachingName || 'Unknown Coaching'
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return studentAttendance;
    } catch (error) {
      console.error('Error getting student attendance history:', error);
      return [];
    }
  };

  // Approve student
  const approveStudent = (studentId) => {
    try {
      const result = updateData('students', studentId, { status: 'Active' });
      if (result) {
        console.log('Student approved:', studentId);
        return { success: true, message: 'Student approved successfully' };
      }
      throw new Error('Failed to approve student');
    } catch (error) {
      console.error('Error approving student:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    qrCode,
    generateQRCode,
    markAttendance,
    getAttendanceByDate,
    getStudentAttendanceHistory,
    approveStudent
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};