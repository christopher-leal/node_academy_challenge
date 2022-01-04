import logger from './../utils/logger'
import validateToken from './validateToken'

const validateOptionalToken = (req, res, next) => {
  if (!req.get('Authorization')) {
    logger.warn('Request without token done')
    return next()
  }
  return validateToken(req, res, next)
}

export default validateOptionalToken
