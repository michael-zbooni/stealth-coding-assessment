import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { OAuthUser } from '../entities/oauth-user.entity'
import { UserService } from '../services/user.service'
import { mainDataSource } from '../data-source'
import { validation } from '../middlewares/validation'
import remapPasswordField from '../middlewares/remap-password-field'
import { validateChangePasswordRequest } from '../middlewares/validate-change-password-request'
import isOwnAccount from '../middlewares/is-own-account'
import { verifyToken } from '../middlewares/verify-token'
import { EmailService } from '../services/email.service'
import { validatePaginationParams } from '../middlewares/validate-pagination-params'

const userRepository = mainDataSource.getRepository(OAuthUser)
const emailService = new EmailService()
const userService = new UserService(userRepository, emailService)
const controller = new UserController(userService)
export const userRouter = Router()

userRouter
  .get('/', validatePaginationParams, controller.handle('list'))
  .get('/verify', controller.handle('verify'))
  .get('/:id', controller.handle('getUser')) // must be below /verify, else verify is treated as an /:id
  .post('/', remapPasswordField, validation(OAuthUser), controller.handle('register'))
  .patch(
    '/:id/change-password',
    verifyToken,
    remapPasswordField,
    validateChangePasswordRequest,
    isOwnAccount,
    controller.handle('changePassword'),
  )
