
import logger from './../utils/logger'
import Comment from './../models/comment'
import Article from './../models/article'
import User from './../models/user'
import formatComments from '../utils/formatComments'

const createComment = async (req, res) => {
  try {
    const { slug } = req.params
    const { body } = req.body.comment

    const article = await Article.findOne({ where: { slug } })
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
    const user = await User.findOne({ where: { email: req.user.email }, include: ['followers'] })
    return res.json({
      success: true,
      comment: formatComments(comment, user)
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
    const comments = await Comment.findAll({ where: { ArticleSlug: slug }, include: [{ model: User, include: ['followers'] }] })
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

    await Comment.destroy({ where: { id } })
    return res.json({
      success: true
    })
  } catch (error) {
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
