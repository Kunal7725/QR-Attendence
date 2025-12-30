// Initialize default data in localStorage
export const initializeData = () => {
  if (!localStorage.getItem('admins')) {
    localStorage.setItem('admins', JSON.stringify([]));
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([]));
  }
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify([]));
  }
  if (!localStorage.getItem('adminStudents')) {
    localStorage.setItem('adminStudents', JSON.stringify({}));
  }
  
  console.log('Data initialized in localStorage');
};

// Generate unique IDs with prefix
export const generateId = (prefix) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

// Sample data for testing (optional)
export const sampleData = {
  admins: [
    {
      adminId: "ADM_1734456789_abc123",
      name: "John Teacher",
      email: "john@coaching.com",
      password: "admin123",
      coachingName: "Excellence Coaching",
      contact: "9876543210",
      status: "Active"
    }
  ],
  students: [
    {
      studentId: "STU_1734456790_def456", 
      name: "Rahul Kumar",
      rollNo: "101",
      batch: "Morning",
      email: "rahul@student.com",
      mobile: "9876543211",
      password: "student123",
      status: "Active"
    }
  ]
};