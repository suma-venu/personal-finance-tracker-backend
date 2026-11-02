const jwt = require('jsonwebtoken')


const protect = (req, res, next) => {
  try {
    let token

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Check whether token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user ID to request
    req.user = {
      userId: decoded.userId
    }

    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    })
  }
}

module.exports = protect
