# QR Code Based Attendance System

A modern, frontend-only attendance management system built with React.js for coaching classes. This system allows admins to generate QR codes and students to scan them to mark their attendance.

## 🚀 Features

### Admin Features
- **Dashboard**: View statistics, generate QR codes, and see recent activity
- **QR Code Generation**: Generate daily QR codes for students to scan
- **Student Management**: Approve/reject student registrations
- **Attendance Records**: View attendance by date with export functionality
- **Student Profiles**: Detailed view of individual student attendance

### Student Features
- **Dashboard**: View attendance summary and status
- **QR Scanner**: Scan QR codes to mark attendance
- **Attendance History**: Track personal attendance records
- **Account Status**: Real-time approval status updates

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser with camera access

## 🛠️ Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd qr-attendance-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "react-qr-code": "^2.0.12",
  "html5-qrcode": "^2.3.8",
  "date-fns": "^2.30.0"
}
```

## 🏗️ Project Structure

```
qr-attendance-frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── css/
│   │   │   ├── common/
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── ui/
│   │   ├── common/
│   │   ├── admin/
│   │   ├── student/
│   │   └── ui/
│   ├── pages/
│   │   ├── css/
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── auth/
│   │   ├── admin/
│   │   ├── student/
│   │   └── auth/
│   ├── layouts/
│   ├── context/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## 🔐 Authentication System

### Admin Signup
1. Navigate to `/signup`
2. Select "Admin" role
3. Fill in: Name, Email, Password, Coaching Name, Contact
4. Auto-generates unique `adminId`
5. Status set to "Active" immediately
6. Auto-login after successful signup

### Student Signup
1. Navigate to `/signup`
2. Select "Student" role
3. Fill in: Name, Roll No, Batch, Email, Mobile, Password
4. Auto-generates unique `studentId`
5. Status set to "Pending Approval"
6. Requires admin approval before QR scanning

### Login
- Separate login flows for Admin and Student
- Email + Password authentication
- Role-based dashboard redirection

## 📊 Data Management

### LocalStorage Structure
```javascript
{
  admins: [
    {
      adminId: "ADM_timestamp_random",
      name: "John Teacher",
      email: "john@coaching.com",
      password: "hashed_password",
      coachingName: "Excellence Coaching",
      contact: "9876543210",
      status: "Active"
    }
  ],
  students: [
    {
      studentId: "STU_timestamp_random",
      name: "Rahul Kumar",
      rollNo: "101",
      batch: "Morning",
      email: "rahul@student.com",
      mobile: "9876543211",
      password: "hashed_password",
      status: "Pending" // or "Active"
    }
  ],
  attendance: [
    {
      adminId: "ADM_xxx",
      studentId: "STU_xxx",
      date: "17/12/2025",
      status: "Present",
      timestamp: "09:30 AM"
    }
  ],
  adminStudents: {
    "ADM_xxx": ["STU_001", "STU_002"]
  }
}
```

## 🎯 Key Workflows

### Admin Workflow
1. **Signup/Login** → Admin Dashboard
2. **Generate QR Code** → Display QR with expiry time
3. **View Attendance** → Select date and view records
4. **Manage Students** → Approve pending students
5. **View Student Profile** → Detailed attendance history

### Student Workflow
1. **Signup** → Wait for approval
2. **Login** → Student Dashboard
3. **Check Status** → Active/Pending indicator
4. **Scan QR Code** → Mark attendance (if approved)
5. **View History** → Personal attendance records

## 🔒 Security Features

- Password validation (minimum 6 characters)
- Email format validation
- QR code expiry validation
- Duplicate attendance prevention
- Role-based access control
- Admin-student data isolation

## 🎨 Design System

### Colors
- Primary: `#3498db` (Blue)
- Secondary: `#2ecc71` (Green)
- Danger: `#e74c3c` (Red)
- Warning: `#f39c12` (Orange)
- Background: `#ecf0f1` (Light Gray)
- Text: `#2c3e50` (Dark Gray)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Responsive font sizes
- Consistent spacing and line heights

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px
- Touch-friendly UI elements
- Optimized camera scanner for mobile

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 🧪 Testing

### Manual Testing Checklist

#### Admin Tests
- [ ] Admin signup and auto-login
- [ ] QR code generation
- [ ] Student approval/rejection
- [ ] Attendance viewing by date
- [ ] Student profile viewing
- [ ] CSV export functionality

#### Student Tests
- [ ] Student signup (pending status)
- [ ] Login with pending account
- [ ] QR code scanning (after approval)
- [ ] Duplicate scan prevention
- [ ] Attendance history viewing
- [ ] Expired QR code handling

## 🐛 Known Limitations

1. **No Backend**: All data stored in localStorage (cleared on browser cache clear)
2. **No Password Hashing**: Passwords stored in plain text (demo purposes only)
3. **Single Device**: Data not synced across devices
4. **Camera Access**: Requires HTTPS in production for camera access
5. **No Email Verification**: Email addresses not verified

## 🔮 Future Enhancements

- Backend API integration
- Real-time notifications
- Bulk student import
- Advanced analytics and reports
- Multi-language support
- Dark mode
- Progressive Web App (PWA)
- Biometric authentication

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add comments for complex logic
- Keep components modular and reusable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Check existing documentation
- Review code comments
- Test in different browsers
- Clear localStorage if data issues occur

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [HTML5 QR Code Scanner](https://github.com/mebjas/html5-qrcode)
- [React QR Code](https://github.com/rosskhanas/react-qr-code)

---

**Built with ❤️ using React.js**