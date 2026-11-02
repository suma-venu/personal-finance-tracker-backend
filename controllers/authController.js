
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      })
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      })
    }

    // Check whether user already exists
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      })
    }

    console.error('Registration error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find user by email
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Login error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}


module.exports = {
  registerUser,
  loginUser
}