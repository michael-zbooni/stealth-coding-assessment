import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'
import { HttpStatusCode } from '../enums/http-status-code.enum'

/**
 * Validates that the user is accessing his/her own account.
 *
 * @param request - the request object from Express
 * @param response - the response object from Express
 * @param next - the next function from Express
 */
export function isOwnAccount(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { id: userId } = request.params
  const user = response.locals.user as OAuthUser | undefined

  if (!user) {
    return response
      .status(HttpStatusCode.Unauthorized)
      .json({ error: 'Unauthorized: OAuth2 bearer token missing, invalid, or expired.' })
  }

  if (user.id !== Number(userId)) {
    return response
      .status(HttpStatusCode.Forbidden)
      .json({ error: `This is not User#${user.id}'s account` })
  }

  next()
}
