
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes')

const app = express()

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Personal finance tracker API is running'
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)

// Transaction routes
app.use('/api/transactions', transactionRoutes)

// Budget routes
app.use('/api/budgets', budgetRoutes)

module.exports = app
