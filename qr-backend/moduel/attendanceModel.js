const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    date: {type: String, required: true},
    status: {type: String, enum: ['Present', 'Absent'], default: 'Present'},
    timestamp: {type: String, required: true}
}, {timestamps: true})

const Attendance = mongoose.model('Attendance', attendanceSchema)
module.exports = Attendance