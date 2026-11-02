const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const app = express()

 

 //middleware

 app.use(cors())
 app.use(express.json())

 //health check route

 app.get('/api/health', (req , res) => {

  res.status(200).json({
success: true,
message: 'Personal finance tracker API is running'

  })


 })

 // Authentication routes
app.use('/api/auth', authRoutes)

// Transaction routes
app.use('/api/transactions', transactionRoutes)

module.exports = app