const { z } = require('zod')
const { formatValidationError } = require('../../utils/validation-helper')

const updateProductSchema = z.object({
  name: z.string('Name must be a string').min(1, 'Product name cannot be empty').optional(),
  price: z.number('Price must be a number').positive('Price must be a positive number').optional(),
  stock: z.number('Stock must be a number').int('Stock must be an integer').min(0, 'Stock cannot be negative').optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
})

module.exports = (req, res, next) => {
  const result = updateProductSchema.safeParse(req.body)
  if (!result.success) {
    const errors = formatValidationError(result.error)
    return res.status(400).json({ success: false, message: 'Validation failed', errors })
  }
  req.body = result.data
  next()
}
