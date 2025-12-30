const API_BASE_URL = 'http://localhost:8000/api';

// Admin APIs
export const adminSignup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/admin/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Student APIs
export const studentSignup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/student/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const studentLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/student/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};