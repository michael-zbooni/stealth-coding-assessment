import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'
import { UserService } from '../services/user.service'
import { mainDataSource } from '../data-source'
import { validation } from '../middlewares/validation'
import remapPasswordField from '../middlewares/remap-password-field'
import { TypeORMError } from 'typeorm'
import { validateChangePasswordRequest } from '../middlewares/validate-change-password-request'
import isOwnAccount from '../middlewares/is-own-account'
import { verifyToken } from '../middlewares/verify-token'
import { EmailService } from '../services/email.service'
import { logger } from '../logger'

const userRepository = mainDataSource.getRepository(OAuthUser)
const emailService = new EmailService()
const userService = new UserService(userRepository, emailService)
const controller = new UserController(userService)
export const userRouter = Router()

// TODO: should be a generic function, accepting a controller as the second parameter
function toExpressCallback(controllerMethod: Express.RequestHandler) {
  return async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => {
    const boundFunction = controllerMethod.bind(controller)
    try {
      const result = await boundFunction(request, response, next)
      response.json(result)
    } catch (error) {
      logger.error(`Error in ${request.url}`, error)
      if (error instanceof TypeORMError && error.message.includes('duplicate key')) {
        // change User to something else when refactoring this function to be generic
        response.status(409).json({ error: 'email already exists' })
      } else if ((error as Error).message) {
        response.status(500).json({ error: (error as Error).message })
      } else {
        response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}

userRouter
  .post('/', remapPasswordField, validation(OAuthUser), toExpressCallback(controller.register))
  .get('/verify', toExpressCallback(controller.verify))
  .get('/', toExpressCallback(controller.list))
  .get('/:id', toExpressCallback(controller.getUser))
  .patch(
    '/:id/change-password',
    verifyToken,
    remapPasswordField,
    validateChangePasswordRequest,
    isOwnAccount,
    toExpressCallback(controller.changePassword),
  )
