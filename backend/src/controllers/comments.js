
import logger from './../utils/logger'
import Comment from './../models/comment'
import Article from './../models/article'
import User from './../models/user'
import formatComments from '../utils/formatComments'
import client from '../db/redis'

const createComment = async (req, res) => {
  try {
    const { slug } = req.params
    const { body } = req.body.comment
    const article = await Article.findByPk(slug, { include: [{ model: User, include: ['followers'] }] })
    if (!article) {
      return res.status(404).json({
        errors: {
          body: ['Article not found']
        }
      })
    }
    const comment = await Comment.create({
      body,
      AuthorUsername: req.user.username,
      ArticleSlug: slug
    })
    logger.info(`Comment created successfully for article ${slug}`)
    await client.hDel('comments', JSON.stringify(slug))
    return res.json({
      success: true,
      comment: formatComments(comment, article.User)
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      errors: { body: [error.message] }
    })
  }
}

const getCommentsFromArticle = async (req, res) => {
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
    const cachedComments = await client.hGet('comments', JSON.stringify(slug))
    if (cachedComments) {
      const comments = JSON.parse(cachedComments)
      logger.info('Comments queried successfully from redis')
      return res.json({
        success: true,
        comments: formatComments(comments)
      })
    }
    const comments = await Comment.findAll({ where: { ArticleSlug: slug }, include: [{ model: User, include: ['followers'] }] })
    logger.info(`Comment queried successfully for article ${slug}`)
    await client.hSet('comments', JSON.stringify(slug), JSON.stringify(comments), 'EX', 10)
    return res.json({
      success: true,
      comments: formatComments(comments)
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      errors: { body: [error.message] }
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const { slug, id } = req.params
    const article = await Article.findOne({ where: { slug } })
    if (!article) {
      return res.status(404).json({
        errors: {
          body: ['Article not found']
        }
      })
    }
    const comment = await Comment.findByPk(id)
    if (!comment) {
      return res.status(404).json({
        errors: {
          body: ['Comment not found']
        }
      })
    }
    if (comment.AuthorUsername !== req.user.username) {
      return res.status(403).json({
        errors: {
          body: ['You must be the author of the comment']
        }
      })
    }
    await comment.destroy()
    logger.info(`Comment deleted successfully for article ${slug}`)
    await client.hDel('comments', JSON.stringify(slug))
    return res.json({
      success: true
    })
  } catch (error) {
    logger.error(error.message)
    return res.status(422).json({
      errors: { body: [error.message] }
    })
  }
}

export default {
  createComment,
  getCommentsFromArticle,
  deleteComment
}
