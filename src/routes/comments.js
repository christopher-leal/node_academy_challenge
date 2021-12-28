import { Router } from 'express'
import validateToken from './../middleware/validateToken'
import commentsController from './../controllers/comments'
import validateFields from './../middleware/validateFields'
import { body } from 'express-validator'
import validateOptionalToken from './../middleware/validateOptionalToken'

const router = Router()

router.post('/:slug/comments', [
  validateToken,
  body('comment.body').notEmpty().withMessage('Body is required'),
  validateFields
], commentsController.createComment)
router.get('/:slug/comments', [validateOptionalToken], commentsController.getCommentsFromArticle)
router.delete('/:slug/comments/:id', [validateToken], commentsController.deleteComment)

export default router
