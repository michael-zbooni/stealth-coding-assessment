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
import { verifyToken } from '../middlewares/verify-token'

const userRepository = mainDataSource.getRepository(OAuthUser)
const userService = new UserService(userRepository)
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
      console.log('result', result)
      response.json(result)
    } catch (error) {
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
    '/:id/changePassword',
    remapPasswordField,
    validateChangePasswordRequest,
    toExpressCallback(controller.changePassword),
  )
