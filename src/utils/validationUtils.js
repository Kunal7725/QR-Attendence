// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Mobile number validation (10 digits)
export const isValidMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

// Roll number validation (not empty)
export const isValidRollNo = (rollNo) => {
  return rollNo && rollNo.trim().length > 0;
};

// Name validation (at least 2 characters)
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Validate QR code data
export const isValidQRData = (qrData) => {
  try {
    const data = JSON.parse(qrData);
    return data.adminId && data.date && data.expiryTime;
  } catch (error) {
    console.log('Invalid QR data format:', error);
    return false;
  }
};