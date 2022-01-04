import { Router } from 'express'
import usersRouter from './users'
import profilesRouter from './profiles'
import articlesRouter from './articles'
import commentsRouter from './comments'
import tagsRouter from './tags'

const router = Router()

router
  .use('/', usersRouter)
  .use('/profiles', profilesRouter)
  .use('/articles', articlesRouter)
  .use('/articles', commentsRouter)
  .use('/tags', tagsRouter)

export default router
