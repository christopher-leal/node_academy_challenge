import { Router } from 'express'
import usersRouter from './users'
import profilesRouter from './profiles'
import articlesRouter from './articles'

const router = Router()

router.use('/', usersRouter)
router.use('/profiles', profilesRouter)
router.use('/articles', articlesRouter)

export default router
