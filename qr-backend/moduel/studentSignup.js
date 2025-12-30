const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    roleNo:{type:String,required:true},
    batch:{type:String, required:true},
    email:{type:String,required:true},
    mobile:{type:String,required:true},
    password:{type:String,required:true},
    status:{type:String, enum:['Pending', 'Active', 'Rejected'], default:'Pending'}
}, {timestamps: true})
const User = mongoose.model('User', userSchema)
module.exports = User