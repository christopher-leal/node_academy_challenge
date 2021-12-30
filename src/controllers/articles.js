import User from '../models/user'
import Article from './../models/article'
import logger from './../utils/logger'
import Tag from './../models/tag'
import slugString from './../utils/slug'
import formatArticles from '../utils/formatArticles'
import { Op } from 'sequelize'
import client from '../db/redis'

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
      const cachedArticles = await client.hGet('articles', JSON.stringify({ favorited: user.username }))
      if (cachedArticles) {
        console.log(cachedArticles)
        const { articles, count } = JSON.parse(cachedArticles)
        logger.info('Articles queried successfully from redis')
        return res.json({
          success: true,
          articles: formatArticles(articles),
          articlesCount: count
        })
      }
      const { rows, count } = await Article.findAndCountAll({ distinct: true, include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }, { association: 'favorites', where: { username: user.username } }] })
      logger.info('Articles queried successfully')
      await client.hSet('articles', JSON.stringify({ favorited: user.username }), JSON.stringify({ articles: rows, count }))
      return res.json({
        success: true,
        articles: formatArticles(rows),
        articlesCount: count
      })
    }
    const whereClause = {
      ...(username && { username }),
      ...(tag && { name: tag })
    }
    const cachedArticles = await client.hGet('articles', JSON.stringify(whereClause))
    if (cachedArticles) {
      const { articles, count } = JSON.parse(cachedArticles)
      logger.info('Articles queried successfully from redis')
      return res.json({
        success: true,
        articles: formatArticles(articles),
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
    logger.info('Articles queried successfully')
    await client.hSet('articles', JSON.stringify(whereClause), JSON.stringify({ articles: rows, count }))
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
    logger.info('Article created successfully')
    await client.del('articles')
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
    const users = await User.findAll({ include: [{ association: 'followers', where: { username: req.user.username } }] })
    const where = users.map(follow => ({
      author: follow.username
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
    logger.info('Feed queried successfully')
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
    const cachedArticle = await client.hGet('article', JSON.stringify(slug))
    if (cachedArticle) {
      const article = JSON.parse(cachedArticle)
      logger.info(`Article ${slug} queried successfully from redis`)
      return res.json({
        success: true,
        article: formatArticles(article, article.User)
      })
    }
    const article = await Article.findByPk(slug, {
      include: [{ model: User, include: ['followers'] }, { model: Tag, attributes: ['name'] }, { association: 'favorites' }]
    })
    console.log(article)
    logger.info(`Article ${slug} queried successfully`)
    if (article) {
      await client.hSet('article', JSON.stringify(slug), JSON.stringify(article))
    }
    return res.json({
      success: true,
      article: formatArticles(article, article.User)
    })
  } catch (error) {
    console.log(error)
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
    logger.info(`Article ${slug} updated successfully`)
    await client.hDel('article', JSON.stringify(slug))
    await client.del('articles')
    await client.hDel('comments', JSON.stringify(slug))
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
    const article = await Article.findOne({ where: { slug } })
    if (!article) {
      return res.status(404).json({
        errors: {
          body: ['Article not found']
        }
      })
    }
    if (article.author !== req.user.username) {
      return res.status(403).json({
        errors: {
          body: ['You must be the author of the comment']
        }
      })
    }
    await article.destroy()
    await client.hDel('article', JSON.stringify(slug))
    await client.hDel('comments', JSON.stringify(slug))
    await client.del('articles')

    logger.info(`Article ${slug} deleted successfully`)
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
    logger.info(`Article ${slug} favorited successfully`)
    await client.hDel('article', JSON.stringify(slug))
    await client.del('articles')
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
    logger.info(`Article ${slug} un favorited successfully`)
    await client.hDel('article', JSON.stringify(slug))
    await client.del('articles')
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
