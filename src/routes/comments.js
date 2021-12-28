import { Router } from 'express'
import validateToken from './../middleware/validateToken'
import commentsController from './../controllers/comments'

const router = Router()

router.post('/:slug/comments', [validateToken], commentsController.createComment)

export default router
