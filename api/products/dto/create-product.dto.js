const { z } = require('zod')
const { formatValidationError } = require('../../utils/validation-helper')

const createProductSchema = z.object({
  name: z.string('Product name is required').min(1, 'Product name is required'),
  price: z.number('Price must be a number').positive('Price must be a positive number'),
  stock: z.number('Stock must be a number').int('Stock must be an integer').min(0, 'Stock cannot be negative'),
  images: z.array(z.string().url('Each image must be a valid URL')).optional().default([]),
})

module.exports = (req, res, next) => {
  const result = createProductSchema.safeParse(req.body)
  if (!result.success) {
    const errors = formatValidationError(result.error)
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }
  req.body = result.data
  next()
}
