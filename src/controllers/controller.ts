import { HttpStatusCode } from '../enums/http-status-code.enum'
import { GenericException } from '../exceptions/generic.exception'
import { logger } from '../logger'
import Express from 'express'

/**
 * Base controller class
 */
export abstract class Controller {
  /**
   * Creates an handler for controller methods that follow the Nest.js or routing-controllers
   * paradigm (i.e. they return values rather than calling `response.json()` directly).  This makes
   * it easier to test (no need to spy on `response.json`).
   *
   * @param methodName - the name of the method to handle
   * @returns An Express handler (.ie. a `(request, response, next) => void` function)
   */
  handle(methodName: keyof this): Express.RequestHandler {
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
          response
            .status(HttpStatusCode.InternalServerError)
            .json({ error: 'Internal server error' })
        }
      }
    }
  }
}
