import { Router } from 'express'
import usersController from './../controllers/users'
import { body } from 'express-validator'
import validateFields from '../middleware/validateFields'
const router = Router()

router.post('/', [body('user.email').notEmpty(), validateFields], usersController.register)
router.post('/login', [body('name').notEmpty(), validateFields], usersController.login)

export default router
