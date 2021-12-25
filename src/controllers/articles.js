import User from '../models/user'
import Article from './../models/article'
import logger from './../utils/logger'
import Tag from './../models/tag'
import { slugString } from './../utils/slug'

const listArticles = async (req, res) => {
  try {
    const { tag, author: username, favorited, limit = 20, offset = 0 } = req.query

    const { rows, count } = await Article.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        ...(favorited && { favorited })
      },
      include: [
        {
          model: User,
          where: {
            ...(username && { username })
          }
        },
        {
          model: Tag,
          attributes: ['name'],
          where: {
            ...(tag && { name: tag })
          }
        }
      ]
    })
    return res.json({
      success: true,
      articles: rows,
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
    const { title, description, body, tagList } = req.body.article
    const slug = slugString(title)
    const article = await Article.create({
      title,
      slug,
      description,
      body,
      authorEmail: req.user.email
    })
    for (const name of tagList) {
      let tag = await Tag.findOne({ where: { name } })
      if (!tag) {
        tag = await Tag.create({ name })
      }
      await article.addTag(tag)
    }
    const _article = await Article.findByPk(article.id, { include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }, { model: Tag, attributes: ['name'] }] })
    return res.json({
      success: true,
      article: {
        slug: _article.slug,
        title: _article.title,
        description: _article.description,
        body: _article.body,
        tagList: _article.tagList,
        createdAt: _article.createdAt,
        updatedAt: _article.updatedAt,
        favorited: _article.favorited,
        favoritesCount: _article.favoritesCount,
        author: _article.author
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
  listArticles,
  createArticle
}
