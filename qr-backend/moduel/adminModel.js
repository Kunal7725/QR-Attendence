const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    coachingName: {type: String, required: true},
    contact: {type: String, required: true},
    status: {type: String, default: 'Active'}
}, {timestamps: true})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin