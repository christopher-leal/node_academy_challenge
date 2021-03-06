import { Router } from 'express'
import profilesController from './../controllers/profiles'
import validateOptionalToken from './../middleware/validateOptionalToken'
import validateToken from './../middleware/validateToken'

const router = Router()

router
  .get('/:username', [validateOptionalToken], profilesController.getProfile)
  .post('/:username/follow', [validateToken], profilesController.follow)
  .delete('/:username/follow', [validateToken], profilesController.unfollow)

export default router
