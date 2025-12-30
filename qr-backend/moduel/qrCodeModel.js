const mongoose = require('mongoose')

const qrCodeSchema = new mongoose.Schema({
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    date: {type: String, required: true},
    expiryTime: {type: String, required: true},
    isActive: {type: Boolean, default: true}
}, {timestamps: true})

const QRCode = mongoose.model('QRCode', qrCodeSchema)
module.exports = QRCode