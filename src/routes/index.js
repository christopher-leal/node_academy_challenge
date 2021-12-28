import { Router } from 'express'
import usersRouter from './users'
import profilesRouter from './profiles'
import articlesRouter from './articles'
import commentsRouter from './comments'

const router = Router()

router.use('/', usersRouter)
router.use('/profiles', profilesRouter)
router.use('/articles', articlesRouter)
router.use('/articles', commentsRouter)

export default router
