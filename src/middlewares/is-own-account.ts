import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'

export default function isOwnAccount(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { userId } = request.params
  const user = response.locals.user as OAuthUser | undefined

  if (!user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  if (user.id !== Number(userId)) {
    return response.status(403).json({ error: 'Forbidden' })
  }

  next()
}
