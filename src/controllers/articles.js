import User from '../models/user'
import Article from './../models/article'
import logger from './../utils/logger'
import Tag from './../models/tag'
import slugString from './../utils/slug'
import formatArticles from '../utils/formatArticles'
import Followers from '../models/followers'
import { Op } from 'sequelize'

const listArticles = async (req, res) => {
  try {
    const { tag, author: username, favorited, limit = 20, offset = 0 } = req.query
    if (favorited) {
      const user = await User.findOne({ where: { username: favorited } })
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: { body: ['User not found'] }
        })
      }
      const { rows, count } = await Article.findAndCountAll({ distinct: true, include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }, { association: 'favorites', where: { username: user.username } }] })

      return res.json({
        success: true,
        articles: formatArticles(rows),
        articlesCount: count
      })
    }
    const { rows, count } = await Article.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true,
      include: [
        {
          model: User,
          where: {
            ...(username && { username })
          },
          include: ['followers']
        },
        {
          model: Tag,
          attributes: ['name'],
          where: {
            ...(tag && { name: tag })
          }
        },
        { association: 'favorites' }
      ]
    })
    return res.json({
      success: true,
      articles: formatArticles(rows),
      articlesCount: count
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
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
    const _article = await Article.findByPk(article.slug, { include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }] })
    return res.json({
      success: true,
      article: formatArticles(_article, _article.User)
    })
  } catch (error) {
    logger.error(error.message)
    console.log(error)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
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
          include: ['followers']
        },
        {
          model: Tag,
          attributes: ['name']
        },
        { association: 'favorites' }
      ]
    })

    return res.json({
      success: true,
      articles: formatArticles(rows),
      articlesCount: count
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const getArticle = async (req, res) => {
  try {
    const { slug } = req.params
    const article = await Article.findByPk(slug, {
      include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }, { association: 'favorites' }
      ]
    })
    return res.json({
      success: true,
      article: formatArticles(article, article.User)
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const updateArticle = async (req, res) => {
  try {
    const { slug } = req.params
    const { title, description, body } = req.body.article
    const article = await Article.findByPk(slug, {
      include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }, { association: 'favorites' }]
    })
    if (!article) {
      return res.status(404).json({
        success: false,
        errors: { body: ['Article not found'] }
      })
    }

    const newTitle = title || article.title
    const newSlug = slugString(newTitle)
    const newDescription = description || article.description
    const newBody = body || article.body
    const articleToUpdate = {
      title: newTitle,
      description: newDescription,
      body: newBody,
      ...(title && { slug: newSlug })

    }
    const updatedArticle = await article.update(articleToUpdate)
    return res.json({
      success: true,
      article: formatArticles(updatedArticle, updatedArticle.User)
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const deleteArticle = async (req, res) => {
  try {
    const { slug } = req.params
    await Article.destroy({ where: { slug } })
    return res.json({
      success: true
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const favorite = async (req, res) => {
  try {
    const { slug } = req.params
    const article = await Article.findByPk(slug, { include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }] })
    const user = await User.findOne({ where: { email: req.user.email }, include: ['followers'] })
    await article.addFavorites(user)
    const favorites = await article.getFavorites()
    article.favorited = true
    article.favoritesCount = favorites.length
    return res.json({
      success: true,
      article: formatArticles(article, user)
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      success: false,
      errors: { body: [error.message] }
    })
  }
}

const unfavorite = async (req, res) => {
  try {
    const { slug } = req.params
    const article = await Article.findByPk(slug, { include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }] })
    const user = await User.findOne({ where: { email: req.user.email }, include: ['followers'] })
    await article.removeFavorites(user)
    const favorites = await article.getFavorites()

    article.favorited = false
    article.favoritesCount = favorites.length
    return res.json({
      success: true,
      article: formatArticles(article, user)
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
  listArticles,
  createArticle,
  getFeed,
  getArticle,
  updateArticle,
  deleteArticle,
  favorite,
  unfavorite
}
