const User = require('../moduel/studentSignup.js')
const bcrypt = require('bcrypt')

const signup = async(req, res) => {
    try {
        const {name, roleNo, batch, email, mobile, password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({name, roleNo, batch, email, mobile, password: hashedPassword})
        await user.save()
        return res.status(201).json({message:'User successfully registered', user:{name, roleNo, batch, email, mobile}})
    } catch(error) {
        console.log(error)
        return res.status(500).json({message:'Server error', error:error.message})
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({message:'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({message:'Invalid credentials'})
        }
        return res.status(200).json({
        message:'Login successful', 
        user:{
          id: user._id, 
          name:user.name, 
          email:user.email, 
          roleNo:user.roleNo, 
          batch:user.batch,
          status:user.status
        }
      })
    } catch(error) {
        console.log(error)
        res.status(500).json({message:'Server error', error:error.message})
    }
}

module.exports = {signup, login}