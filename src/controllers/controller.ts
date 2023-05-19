import { GenericException } from '../exceptions/generic.exception'
import { logger } from '../logger'
import Express from 'express'

export abstract class Controller {
  handle(methodName: keyof this) {
    return async (
      request: Express.Request,
      response: Express.Response,
      next: Express.NextFunction,
    ) => {
      try {
        const result = await (this[methodName] as CallableFunction)(request, response, next)
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
}
