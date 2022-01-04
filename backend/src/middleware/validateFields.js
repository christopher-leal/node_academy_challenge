import { validationResult } from 'express-validator'

const validateFields = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: {
        body: errors.array()
      }
    })
  }
  next()
}
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${msg}`
}

export default validateFields
