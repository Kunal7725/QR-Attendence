import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../css/auth/Signup.css';

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    password: '',
    // Admin specific
    coachingName: '',
    contact: '',
    // Student specific
    rollNo: '',
    batch: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signupAdmin, signupStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
    setSuccess('');
    // Reset form data when switching roles
    setFormData({
      name: '',
      email: '',
      password: '',
      coachingName: '',
      contact: '',
      rollNo: '',
      batch: '',
      mobile: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (selectedRole === 'admin') {
        result = await signupAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          coachingName: formData.coachingName,
          contact: formData.contact
        });
        
        if (result.success) {
          setSuccess('Admin account created successfully! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 2000);
        } else {
          setError(result.error);
        }
      } else {
        result = await signupStudent({
          name: formData.name,
          rollNo: formData.rollNo,
          batch: formData.batch,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        });
        
        if (result.success) {
          setSuccess(result.message + ' You can now login.');
          // Don't auto-redirect for students, they need admin approval
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join our QR attendance system</p>
        </div>

        {/* Role Selection */}
        <div className="role-selector">
          <div 
            className={`role-option ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('student')}
          >
            <div className="role-title">Student</div>
            <div className="role-desc">Mark attendance by scanning QR codes</div>
          </div>
          <div 
            className={`role-option ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <div className="role-title">Admin</div>
            <div className="role-desc">Generate QR codes and manage students</div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className={`signup-form ${selectedRole}-form`}>
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Role-specific fields */}
          {selectedRole === 'admin' ? (
            <>
              <div className="form-group">
                <label htmlFor="coachingName" className="form-label">Coaching Name</label>
                <input
                  type="text"
                  id="coachingName"
                  name="coachingName"
                  value={formData.coachingName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter coaching institute name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact" className="form-label">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rollNo" className="form-label">Roll Number</label>
                  <input
                    type="text"
                    id="rollNo"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter roll number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="batch" className="form-label">Batch</label>
                  <select
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Batch</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password (min 6 characters)"
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Create ${selectedRole === 'admin' ? 'Admin' : 'Student'} Account`}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;