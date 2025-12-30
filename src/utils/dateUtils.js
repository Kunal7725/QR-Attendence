import { format, isToday as isTodayFns, parseISO } from 'date-fns';

// Format date as DD/MM/YYYY
export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    // If it's already in DD/MM/YYYY format, return as is
    if (date.includes('/')) return date;
    // If it's ISO string, parse it
    date = parseISO(date);
  }
  
  return format(date, 'dd/MM/yyyy');
};

// Check if date is today
export const isToday = (date) => {
  if (!date) return false;
  
  if (typeof date === 'string') {
    // Convert DD/MM/YYYY to Date object
    const [day, month, year] = date.split('/');
    date = new Date(year, month - 1, day);
  }
  
  return isTodayFns(date);
};

// Check if time has expired (format: HH:MM)
export const isExpired = (expiryTime) => {
  if (!expiryTime) return true;
  
  const now = new Date();
  const [hours, minutes] = expiryTime.split(':');
  const expiryDate = new Date();
  expiryDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return now > expiryDate;
};

// Get current time in HH:MM AM/PM format
export const getCurrentTime = () => {
  return format(new Date(), 'hh:mm a');
};

// Get today's date in DD/MM/YYYY format
export const getTodayDate = () => {
  return formatDate(new Date());
};