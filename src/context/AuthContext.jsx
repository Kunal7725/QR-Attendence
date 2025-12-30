import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, addData } from '../utils/storageUtils';
import { generateId } from '../utils/mockData';
import { isValidEmail, isValidPassword } from '../utils/validationUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Admin signup
  const signupAdmin = async (formData) => {
    try {
      const { name, email, password, coachingName, contact } = formData;
      
      // Validation
      if (!name || !email || !password || !coachingName || !contact) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if admin already exists
      const admins = getData('admins');
      const existingAdmin = admins.find(admin => admin.email === email);
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      // Create new admin
      const newAdmin = {
        adminId: generateId('ADM'),
        name,
        email,
        password, // In real app, this should be hashed
        coachingName,
        contact,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      addData('admins', newAdmin);
      
      // Auto login after signup
      const userSession = {
        role: 'admin',
        adminId: newAdmin.adminId,
        name: newAdmin.name,
        email: newAdmin.email
      };
      
      setCurrentUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      
      return { success: true, user: userSession };
    } catch (error) {
      console.error('Admin signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Student signup
  const signupStudent = async (formData) => {
    try {
      const { name, rollNo, batch, email, mobile, password } = formData;
      
      // Validation
      if (!name || !rollNo || !batch || !email || !mobile || !password) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if student already exists
      const students = getData('students');
      const existingStudent = students.find(student => 
        student.email === email || student.rollNo === rollNo
      );
      if (existingStudent) {
        throw new Error('Student with this email or roll number already exists');
      }

      // Create new student
      const newStudent = {
        studentId: generateId('STU'),
        name,
        rollNo,
        batch,
        email,
        mobile,
        password, // In real app, this should be hashed
        status: 'Pending', // Needs admin approval
        createdAt: new Date().toISOString()
      };

      addData('students', newStudent);
      
      return { success: true, message: 'Account created! Please wait for admin approval.' };
    } catch (error) {
      console.error('Student signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password, role) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (role === 'admin') {
        const admins = getData('admins');
        const admin = admins.find(a => a.email === email && a.password === password);
        
        if (!admin) {
          throw new Error('Invalid admin credentials');
        }

        const userSession = {
          role: 'admin',
          adminId: admin.adminId,
          name: admin.name,
          email: admin.email
        };
        
        setCurrentUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return { success: true, user: userSession };
      } else {
        const students = getData('students');
        const student = students.find(s => s.email === email && s.password === password);
        
        if (!student) {
          throw new Error('Invalid student credentials');
        }

        const userSession = {
          role: 'student',
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          status: student.status
        };
        
        setCurrentUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return { success: true, user: userSession };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    loading,
    signupAdmin,
    signupStudent,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};