import User from '../models/user'
import logger from './../utils/logger'

const getProfile = async (req, res) => {
  const { username } = req.params
  try {
    const userToFollow = await User.findOne({ where: { username }, include: ['followers'] })
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    const following = !!userToFollow.followers.find((user) => user.username === req.user?.username)
    const profile = {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: userToFollow.image,
      following
    }
    return res.json({
      success: true,
      profile
    })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const follow = async (req, res) => {
  const { username } = req.params
  try {
    const userToFollow = await User.findOne({ where: { username }, include: ['followers'] })
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    const user = await User.findOne({ where: { email: req.user.email } })
    await userToFollow.addFollowers(user)

    const profile = {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: userToFollow.image,
      following: true
    }
    return res.json({
      success: true,
      profile
    })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const unfollow = async (req, res) => {
  const { username } = req.params
  try {
    const userToFollow = await User.findOne({ where: { username }, include: ['followers'] })
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    const user = await User.findOne({ where: { email: req.user.email } })

    await userToFollow.removeFollowers(user)

    const profile = {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: userToFollow.image,
      following: false
    }
    return res.json({
      success: true,
      profile

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
  getProfile,
  follow,
  unfollow
}
