import { Router } from 'express'
import articlesController from './../controllers/articles'
import validateOptionalToken from './../middleware/validateOptionalToken'
import validateToken from './../middleware/validateToken'
import validateFields from './../middleware/validateFields'
import { body } from 'express-validator'

const router = Router()

router
  .get('/', [validateOptionalToken], articlesController.listArticles)
  .post('/', [
    validateToken,
    body('article.title').notEmpty().withMessage('Title is required'),
    body('article.description').notEmpty().withMessage('Description is required'),
    body('article.body').notEmpty().withMessage('Body is required'),
    body('article.tagList').exists().optional().isArray().withMessage('Tag list must be an array'),
    validateFields
  ], articlesController.createArticle)
  .get('/feed', [validateToken], articlesController.getFeed)
  .get('/:slug', articlesController.getArticle)
  .put('/:slug', [
    validateToken,
    body('article.title').exists().optional(),
    body('article.description').exists().optional(),
    body('article.body').exists().optional(),
    validateFields
  ], articlesController.updateArticle)
  .delete('/:slug', [validateToken], articlesController.deleteArticle)
  .post('/:slug/favorite', [validateToken], articlesController.favorite)
  .delete('/:slug/favorite', [validateToken], articlesController.unfavorite)

export default router
