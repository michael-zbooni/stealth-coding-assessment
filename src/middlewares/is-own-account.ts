import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'

/**
 * Validates that the user is accessing his/her own account.
 *
 * @param request - the request object from Express
 * @param response - the response object from Express
 * @param next - the next function from Express
 */
export default function isOwnAccount(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { id: userId } = request.params
  const user = response.locals.user as OAuthUser | undefined

  if (!user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  if (user.id !== Number(userId)) {
    return response.status(403).json({ error: 'Forbidden' })
  }

  next()
}
