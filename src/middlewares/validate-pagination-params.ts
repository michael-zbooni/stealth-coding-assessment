import Express from 'express'

import { isNumberString } from 'class-validator'

export function validatePaginationParams(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { limit, offset } = request.query
  if (limit && !isNumberString(limit)) {
    response.status(400).json({ error: 'Invalid limit' })
    return
  }
  if (offset && !isNumberString(offset)) {
    response.status(400).json({ error: 'Invalid offset' })
    return
  }

  // check negative OR 0 limit
  if (limit && Number(limit) <= 0) {
    response.status(400).json({ error: 'Limit cannot be negative' })
    return
  }
  // check negative offset
  if (offset && Number(offset) < 0) {
    response.status(400).json({ error: 'Offset cannot be negative' })
    return
  }

  next()
}
