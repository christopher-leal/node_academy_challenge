import { decrypt, encrypt } from '../utils/hash'
import { generateToken } from '../utils/jwt'
import User from './../models/user'
import logger from './../utils/logger'

const login = async (req, res) => {
  const { email, password } = req.body.user
  try {
    const user = await User.findOne({ where: { email } })
    if (!user || !decrypt(password, user.password)) {
      return res.status(401).json({
        success: false,
        errors: { body: ['email or password doesn\'t match'] }
      })
    }
    const token = generateToken({
      username: user.username,
      email: user.email
    })
    logger.info(`User ${email} logged in successfully`)
    return res.json({
      success: true,
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      }
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const register = async (req, res) => {
  const { email, password, username } = req.body.user
  try {
    const hashedPassword = encrypt(password)
    const user = await User.create({ email, password: hashedPassword, username })
    const token = generateToken({
      username: user.username,
      email: user.email
    })
    logger.info(`User ${email} registered successfully`)
    return res.json({
      success: true,
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      }
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const { email } = req.user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: { body: ['User not found'] }

      })
    }
    logger.info(`Get current user ${email} successfully`)
    return res.json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: req.user.token
      }
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } })
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: { body: ['User not found'] }
      })
    }
    const username = req.body.user.username || user.username
    const email = req.body.user.email || user.email
    const password = req.body.user.password ? encrypt(req.body.user.password) : user.password
    const image = req.body.user.image || user.image
    const bio = req.body.user.bio || user.bio
    const updatedUser = await user.update({
      username,
      email,
      password,
      image,
      bio
    })
    logger.info(`User ${email} updated successfully`)
    return res.json({
      success: true,
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image,
        token: req.user.token
      }
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

export default {
  register,
  login,
  getCurrentUser,
  updateUser
}
