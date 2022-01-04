import { Router } from 'express'
import tagsController from './../controllers/tags'

const router = Router()

router.get('/', tagsController.getTags)

export default router
