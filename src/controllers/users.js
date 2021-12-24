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
        error: 'email or password doesn\'t match'
      })
    }
    const token = generateToken({
      username: user.username,
      email: user.email
    })
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
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
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
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
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
        error: 'User not found'
      })
    }

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
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    const username = req.body.username || user.username
    const email = req.body.email || user.email
    const password = req.body.password ? encrypt(req.body.password) : user.password
    const image = req.body.image || user.image
    const bio = req.body.bio || user.bio

    const updatedUser = await user.update({
      username,
      email,
      password,
      image,
      bio

    })

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
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export default {
  register,
  login,
  getCurrentUser,
  updateUser
}
