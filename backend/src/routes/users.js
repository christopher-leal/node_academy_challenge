import { Router } from 'express'
import usersController from './../controllers/users'
import { body } from 'express-validator'
import validateFields from '../middleware/validateFields'
import validateToken from './../middleware/validateToken'
const router = Router()

router
  .post('/users', [
    body('user.email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must follow format email@domain.com'),
    body('user.password').notEmpty().withMessage('Password is required'),
    body('user.username').notEmpty().withMessage('Username is required'),
    validateFields
  ], usersController.register)
  .post('/users/login', [
    body('user.email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must follow format email@domain.com'),
    body('user.password').notEmpty().withMessage('Password is required'),
    validateFields
  ], usersController.login)
  .get('/user', [
    validateToken
  ], usersController.getCurrentUser)
  .put('/user', [
    validateToken,
    body('user.email').exists().optional().isEmail().withMessage('Email have to have email@domain.com format'),
    validateFields
  ], usersController.updateUser)

export default router
