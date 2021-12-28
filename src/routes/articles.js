import { Router } from 'express'
import articlesController from './../controllers/articles'
import validateOptionalToken from './../middleware/validateOptionalToken'
import validateToken from './../middleware/validateToken'
import validateFields from './../middleware/validateFields'
import { body } from 'express-validator'

const router = Router()

router.get('/', [validateOptionalToken], articlesController.listArticles)
router.post('/', [
  validateToken,
  body('article.title').notEmpty().withMessage('Title is required'),
  body('article.description').notEmpty().withMessage('Description is required'),
  body('article.body').notEmpty().withMessage('Body is required'),
  body('article.tagList').exists().optional().isArray().withMessage('Tag list must be an array'),
  validateFields
], articlesController.createArticle)
router.get('/feed', [validateToken], articlesController.getFeed)
router.get('/:slug', articlesController.getArticle)
router.put('/:slug', [
  validateToken,
  body('article.title').exists().optional(),
  body('article.description').exists().optional(),
  body('article.body').exists().optional(),
  validateFields
], articlesController.updateArticle)
router.delete('/:slug', [validateToken], articlesController.deleteArticle)

export default router
