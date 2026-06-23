const { z } = require('zod')
const { formatValidationError } = require('../../utils/validation-helper')

const loginSchema = z.object({
  email: z.string('Email is required').email('Invalid email address'),
  password: z.string('Password is required').min(1, 'Password is required'),
})

module.exports = (req, res, next) => {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) {
    const errors = formatValidationError(result.error)
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }
  req.body = result.data
  next()
}
