const formatValidationError = (zodError) => {
  const errors = {}
  zodError.issues.forEach((issue) => {
    const field = issue.path.join('.')
    if (!errors[field]) {
      errors[field] = []
    }
    errors[field].push(issue.message)
  })
  return errors
}

module.exports = { formatValidationError }
