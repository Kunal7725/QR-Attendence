const User = require('../moduel/studentSignup.js')
const QRCode = require('../moduel/qrCodeModel.js')
const Attendance = require('../moduel/attendanceModel.js')

// Scan QR and mark attendance
const scanQR = async(req, res) => {
    try {
        const {studentId, qrData} = req.body
        const {adminId, date, expiryTime} = JSON.parse(qrData)
        
        // Check if student is active
        const student = await User.findById(studentId)
        if(!student || student.status !== 'Active') {
            return res.status(400).json({message: 'Account pending approval'})
        }
        
        // Check if QR is valid and not expired
        const currentTime = new Date().toLocaleTimeString('en-GB', {hour12: false})
        if(currentTime > expiryTime) {
            return res.status(400).json({message: 'QR code expired'})
        }
        
        // Check if already marked today
        const existingAttendance = await Attendance.findOne({studentId, adminId, date})
        if(existingAttendance) {
            return res.status(400).json({message: 'Already marked today'})
        }
        
        // Mark attendance
        const attendance = new Attendance({
            studentId,
            adminId,
            date,
            status: 'Present',
            timestamp: new Date().toLocaleTimeString('en-GB', {hour12: true})
        })
        
        await attendance.save()
        res.status(201).json({message: 'Attendance marked successfully'})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get student attendance history
const getAttendanceHistory = async(req, res) => {
    try {
        const {studentId} = req.params
        const attendance = await Attendance.find({studentId})
            .populate('adminId', 'name coachingName')
            .sort({createdAt: -1})
        
        res.status(200).json({attendance})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get student stats
const getStudentStats = async(req, res) => {
    try {
        const {studentId} = req.params
        const attendance = await Attendance.find({studentId})
        
        const totalDays = attendance.length
        const presentDays = attendance.filter(a => a.status === 'Present').length
        const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
        
        // Today's status
        const today = new Date().toLocaleDateString('en-GB')
        const todayRecord = attendance.find(a => a.date === today)
        
        res.status(200).json({
            totalDays,
            presentDays,
            absentDays: totalDays - presentDays,
            percentage,
            todayStatus: todayRecord ? todayRecord.status : null,
            todayTime: todayRecord ? todayRecord.timestamp : null
        })
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

module.exports = {
    scanQR,
    getAttendanceHistory,
    getStudentStats
}