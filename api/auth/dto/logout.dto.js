module.exports = (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).json({
      success: false,
      message: 'Validation failed',
      errors: { token: ['No active session found'] },
    })
  }
  next()
}
