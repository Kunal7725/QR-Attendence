const mongoose = require('mongoose')
const connection = 'mongodb+srv://QR:QR@cluster0.ps9zvfo.mongodb.net/qr-attendance'
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log('mongoDB connected successfully'))
.catch((error)=>console.log('MongoDB connection error:', error.message))