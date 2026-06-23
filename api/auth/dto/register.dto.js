const { z } = require('zod')
const { formatValidationError } = require('../../utils/validation-helper')

const registerSchema = z.object({
  email: z.string('Email is required').email('Invalid email address'),
  password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
})

module.exports = (req, res, next) => {
  const result = registerSchema.safeParse(req.body)
  if (!result.success) {
    const errors = formatValidationError(result.error)
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }
  req.body = result.data
  next()
}
