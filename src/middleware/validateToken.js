import { verifyToken } from '../utils/jwt'
import logger from './../utils/logger'

const validateToken = (req, res, next) => {
  const authorizationHeader = req.get('Authorization')
  const token = authorizationHeader.replace('Token ', '')
  console.info(token)
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    req.user.token = token
    next()
  } catch (err) {
    logger.error(err)
    return res.status(401).json({
      success: false,
      error: err.message
    })
  }
}

export default validateToken
