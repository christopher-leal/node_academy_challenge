import User from '../models/user'
import Article from './../models/article'
import logger from './../utils/logger'
import Tag from './../models/tag'
import { slugString } from './../utils/slug'
import { formatArticles } from '../utils/formatArticle'
import Followers from '../models/followers'
import { Op } from 'sequelize'

const listArticles = async (req, res) => {
  try {
    const { tag, author: username, favorited, limit = 20, offset = 0 } = req.query
    const { rows, count } = await Article.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        ...(favorited && { favorited })
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      include: [
        {
          model: User,
          where: {
            ...(username && { username })
          },
          attributes: ['username', 'bio', 'image'],
          include: ['followers'],
          required: false
        },
        {
          model: Tag,
          attributes: ['name'],
          where: {
            ...(tag && { name: tag })
          },
          required: false
        }
      ]
    })
    const articles = formatArticles(rows, req.user?.username)
    return res.json({
      success: true,
      articles,
      articlesCount: count
    })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const createArticle = async (req, res) => {
  try {
    const { title, description, body, tagList = [] } = req.body.article
    const slug = slugString(title)
    const article = await Article.create({
      title,
      slug,
      description,
      body,
      author: req.user.username
    })

    for (const name of tagList) {
      let tag = await Tag.findOne({ where: { name } })
      if (!tag) {
        tag = await Tag.create({ name })
      }
      await article.addTag(tag)
    }
    const _article = await Article.findByPk(article.slug, { include: [{ model: User, attributes: ['username', 'bio', 'image'], include: ['followers'] }, { model: Tag, attributes: ['name'] }] })
    return res.json({
      success: true,
      article: formatArticles(_article, req.user?.username)
    })
  } catch (error) {
    logger.error(error)
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const getFeed = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query
    const following = await Followers.findAll({ where: { follower: req.user.username } })
    const where = following.map(follow => ({
      author: follow.following
    }))
    const { rows, count } = await Article.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
      where: {
        [Op.or]: where
      },
      include: [
        {
          model: User,
          attributes: ['username', 'bio', 'image'],
          include: ['followers']
        },
        {
          model: Tag,
          attributes: ['name']
        }
      ]
    })
    const articles = formatArticles(rows, req.user?.username)
    return res.json({
      success: true,
      articles,
      articlesCount: count
    })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const getArticle = async (req, res) => {
  try {
    const { slug } = req.params
    const article = await Article.findByPk(slug, { include: [{ model: User, attributes: ['username', 'bio', 'image'], include: ['followers'] }, { model: Tag, attributes: ['name'] }] })
    return res.json({
      success: true,
      article: formatArticles(article, req?.user?.username)
    })
  } catch (error) {
    logger.error(error)
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export default {
  listArticles,
  createArticle,
  getFeed,
  getArticle
}
