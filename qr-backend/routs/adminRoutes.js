const express = require('express')
const {adminSignup, adminLogin} = require('../component/adminAuth.js')
const {generateQR, getPendingStudents, approveStudent, getAttendanceByDate, getAdminStats, getStudentDetails} = require('../component/adminController.js')
const router = express.Router()

// Auth routes
router.post('/admin/signup', adminSignup)
router.post('/admin/login', adminLogin)

// QR routes
router.post('/admin/generate-qr', generateQR)

// Student management
router.get('/admin/pending-students', getPendingStudents)
router.put('/admin/approve-student/:id', approveStudent)
router.get('/admin/student/:id', getStudentDetails)

// Attendance
router.get('/admin/attendance', getAttendanceByDate)
router.get('/admin/stats', getAdminStats)

module.exports = router