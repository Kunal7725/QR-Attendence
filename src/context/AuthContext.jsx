import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminSignup as apiAdminSignup, adminLogin as apiAdminLogin, studentSignup as apiStudentSignup, studentLogin as apiStudentLogin } from '../utils/api';
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
      
      if (!name || !email || !password || !coachingName || !contact) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      const result = await apiAdminSignup({ name, email, password, coachingName, contact });
      
      if (result.message === 'Admin registered successfully') {
        const userSession = {
          role: 'admin',
          adminId: result.admin.id || 'temp_id',
          name: result.admin.name,
          email: result.admin.email
        };
        
        setCurrentUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return { success: true, user: userSession };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Admin signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Student signup
  const signupStudent = async (formData) => {
    try {
      const { name, rollNo, batch, email, mobile, password } = formData;
      
      if (!name || !rollNo || !batch || !email || !mobile || !password) {
        throw new Error('All fields are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      const result = await apiStudentSignup({ name, rollNo, batch, email, mobile, password });
      
      if (result.message === 'User successfully registered') {
        return { success: true, message: result.message + ' Please wait for admin approval.' };
      } else {
        return { success: false, error: result.message };
      }
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
        const result = await apiAdminLogin({ email, password });
        
        if (result.message === 'Login successful') {
          const userSession = {
            role: 'admin',
            adminId: result.admin.id,
            name: result.admin.name,
            email: result.admin.email
          };
          
          setCurrentUser(userSession);
          localStorage.setItem('currentUser', JSON.stringify(userSession));
          
          return { success: true, user: userSession };
        } else {
          return { success: false, error: result.message };
        }
      } else {
        const result = await apiStudentLogin({ email, password });
        
        if (result.message === 'Login successful') {
          const userSession = {
            role: 'student',
            studentId: result.user.id,
            name: result.user.name,
            email: result.user.email,
            status: result.user.status || 'Active'
          };
          
          setCurrentUser(userSession);
          localStorage.setItem('currentUser', JSON.stringify(userSession));
          
          return { success: true, user: userSession };
        } else {
          return { success: false, error: result.message };
        }
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