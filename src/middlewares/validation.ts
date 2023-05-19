import Express from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'

/**
 * Creates a middleware function that Validates the request body against the validation rules
 * defined in the entity class.
 *
 * @param classType - the class of the entity to validate
 * @returns the validation middleware
 */
export const validation = <T extends object>(classType: new () => T): Express.RequestHandler => {
  return async function validationMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    // Convert request body to the class instance
    const instance = plainToInstance(classType, request.body)
    const errors = await validate(instance, { whitelist: true })

    if (errors.length > 0) {
      const errorsMap = _.chain(errors)
        .map(({ property, constraints }) => [property, constraints])
        .fromPairs()
        .value()

      // If validation fails, throw an error
      return response.status(400).json({ errors: errorsMap })
    }

    // If validation succeeds, move to the next middleware
    next()
  }
}
