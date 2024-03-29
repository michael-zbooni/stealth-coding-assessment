import Express from 'express'

import { isNumberString } from 'class-validator'
import { HttpStatusCode } from '../enums/http-status-code.enum'
import { defaultPaginationLimits } from '../config'

/**
 * Validates that the pagination params are valid.
 *
 * @param request - the request object from Express
 * @param response - the response object from Express
 * @param next - the next function from Express
 */
export function validatePaginationParams(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { limit, offset } = request.query
  if (limit && !isNumberString(limit)) {
    response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid limit' })
    return
  }
  if (offset && !isNumberString(offset)) {
    response.status(HttpStatusCode.BadRequest).json({ error: 'Invalid offset' })
    return
  }

  // check negative OR 0 limit
  if (limit != null && Number(limit) <= 0) {
    response.status(HttpStatusCode.BadRequest).json({ error: 'Limit cannot be zero or negative' })
    return
  }
  // check negative offset
  if (offset && Number(offset) < 0) {
    response.status(HttpStatusCode.BadRequest).json({ error: 'Offset cannot be negative' })
    return
  }

  // too much limit can be bad for performance
  if (limit && Number(limit) > defaultPaginationLimits.MAX) {
    response.status(HttpStatusCode.BadRequest).json({ error: 'Limit is too high' })
    return
  }

  next()
}
