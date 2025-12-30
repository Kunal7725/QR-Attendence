const express = require('express')
const cors = require('cors')
require('./connection/connection.js')
const studentSignup = require('./routs/studentRoutes.js')
const adminRoutes = require('./routs/adminRoutes.js')   

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', studentSignup)
app.use('/api', adminRoutes)

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'QR Backend API is running' })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})