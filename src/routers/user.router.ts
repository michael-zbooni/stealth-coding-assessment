import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'
import { UserService } from '../services/user.service'
import { mainDataSource } from '../data-source'

const userRepository = mainDataSource.getRepository(OAuthUser)
const userService = new UserService(userRepository)
const controller = new UserController(userService)
export const userRouter = Router()

// TODO: should be a generic function, accepting a controller as the second parameter
function toExpressCallback(controllerMethod: Function) {
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
      if (error instanceof Error) {
        response.status(500).json({ error: error.message })
      } else {
        response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}

userRouter
  .post('/', toExpressCallback(controller.register))
  .get('/verify', toExpressCallback(controller.verify))