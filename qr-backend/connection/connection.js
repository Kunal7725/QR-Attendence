const mongoose = require('mongoose')
const connection = 'mongodb+srv://QR:QR@cluster0.ps9zvfo.mongodb.net/?appName=Cluster0'
mongoose.connect(connection)
.then(()=>console.log('mongoDB connected'))
.catch((error)=>console.log(error.message))