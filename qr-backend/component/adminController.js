const Admin = require('../moduel/adminModel.js')
const User = require('../moduel/studentSignup.js')
const QRCode = require('../moduel/qrCodeModel.js')
const Attendance = require('../moduel/attendanceModel.js')

// Generate QR Code
const generateQR = async(req, res) => {
    try {
        const {adminId} = req.body
        const today = new Date().toLocaleDateString('en-GB')
        
        const existingQR = await QRCode.findOne({adminId, date: today})
        if(existingQR) {
            return res.status(200).json({message: 'QR already exists', qrData: existingQR})
        }
        
        const qrData = {
            adminId,
            date: today,
            expiryTime: '23:59'
        }
        
        const newQR = new QRCode(qrData)
        await newQR.save()
        
        res.status(201).json({message: 'QR generated', qrData})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get pending students
const getPendingStudents = async(req, res) => {
    try {
        const students = await User.find({status: 'Pending'})
        res.status(200).json({students})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Approve student
const approveStudent = async(req, res) => {
    try {
        const {id} = req.params
        await User.findByIdAndUpdate(id, {status: 'Active'})
        res.status(200).json({message: 'Student approved'})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get attendance by date
const getAttendanceByDate = async(req, res) => {
    try {
        const {adminId, date} = req.query
        const attendance = await Attendance.find({adminId, date}).populate('studentId', 'name roleNo')
        res.status(200).json({attendance})
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get admin stats
const getAdminStats = async(req, res) => {
    try {
        const {adminId} = req.query
        const today = new Date().toLocaleDateString('en-GB')
        
        const linkedStudents = await Attendance.distinct('studentId', {adminId})
        const totalStudents = linkedStudents.length
        const activeStudents = await User.countDocuments({_id: {$in: linkedStudents}, status: 'Active'})
        const pendingStudents = await User.countDocuments({status: 'Pending'})
        const todayPresent = await Attendance.countDocuments({adminId, date: today})
        
        res.status(200).json({
            totalStudents,
            activeStudents,
            pendingApprovals: pendingStudents,
            todayPresent,
            todayAbsent: activeStudents - todayPresent
        })
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

// Get student details
const getStudentDetails = async(req, res) => {
    try {
        const {id} = req.params
        const {adminId} = req.query
        
        const student = await User.findById(id)
        const attendance = await Attendance.find({studentId: id, adminId}).sort({createdAt: -1})
        
        const totalDays = attendance.length
        const presentDays = attendance.filter(a => a.status === 'Present').length
        const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
        
        res.status(200).json({
            student,
            attendance,
            stats: {totalDays, presentDays, absentDays: totalDays - presentDays, percentage}
        })
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

module.exports = {
    generateQR,
    getPendingStudents,
    approveStudent,
    getAttendanceByDate,
    getAdminStats,
    getStudentDetails
}