const Admin = require('../moduel/adminModel.js')
const bcrypt = require('bcrypt')

const adminSignup = async(req, res) => {
    try {
        const {name, email, password, coachingName, contact} = req.body
        
        const existingAdmin = await Admin.findOne({email})
        if(existingAdmin) {
            return res.status(400).json({message: 'Admin already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = new Admin({
            name, 
            email, 
            password: hashedPassword, 
            coachingName, 
            contact
        })
        
        await admin.save()
        return res.status(201).json({
            message: 'Admin registered successfully', 
            admin: {name, email, coachingName, contact}
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: 'Server error', error: error.message})
    }
}

const adminLogin = async(req, res) => {
    try {
        const {email, password} = req.body
        
        const admin = await Admin.findOne({email})
        if(!admin) {
            return res.status(400).json({message: 'Invalid credentials'})
        }
        
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }
        
        return res.status(200).json({
            message: 'Login successful',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                coachingName: admin.coachingName
            }
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: 'Server error', error: error.message})
    }
}

module.exports = {adminSignup, adminLogin}