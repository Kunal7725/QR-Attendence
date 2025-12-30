const express = require('express')
const {signup, login} = require('../component/auth.js')
const {scanQR, getAttendanceHistory, getStudentStats} = require('../component/studentController.js')
const router = express.Router()

// Auth routes
router.post('/student/signup', signup)
router.post('/student/login', login)

// Attendance routes
router.post('/student/scan-qr', scanQR)
router.get('/student/attendance-history/:studentId', getAttendanceHistory)
router.get('/student/stats/:studentId', getStudentStats)

module.exports = router