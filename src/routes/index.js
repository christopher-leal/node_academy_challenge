import { Router } from 'express'
import usersRouter from './users'
import profilesRouter from './profiles'

const router = Router()

router.use('/', usersRouter)
router.use('/profiles', profilesRouter)

export default router
