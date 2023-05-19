import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'
import { UserService } from '../services/user.service'
import { mainDataSource } from '../data-source'
import { validation } from '../middlewares/validation'
import remapPasswordField from '../middlewares/remap-password-field'
import { validateChangePasswordRequest } from '../middlewares/validate-change-password-request'
import isOwnAccount from '../middlewares/is-own-account'
import { verifyToken } from '../middlewares/verify-token'
import { EmailService } from '../services/email.service'
import { logger } from '../logger'
import { GenericException } from '../exceptions/generic.exception'

const userRepository = mainDataSource.getRepository(OAuthUser)
const emailService = new EmailService()
const userService = new UserService(userRepository, emailService)
const controller = new UserController(userService)
export const userRouter = Router()

// TODO: should be a generic function, accepting a controller as the second parameter
function toHandler(controllerMethod: Express.RequestHandler) {
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
      if (error instanceof GenericException && error.message) {
        response.status(error.status).json({ error: (error as Error).message })
      } else {
        response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}

userRouter
  .post('/', remapPasswordField, validation(OAuthUser), toHandler(controller.register))
  .get('/', toHandler(controller.list))
  .get('/verify', toHandler(controller.verify))
  .get('/:id', toHandler(controller.getUser)) // must be below /verify, else verify is treated as an /:id
  .patch(
    '/:id/change-password',
    verifyToken,
    remapPasswordField,
    validateChangePasswordRequest,
    isOwnAccount,
    toHandler(controller.changePassword),
  )
