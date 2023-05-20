import Express from 'express'
import { mainDataSource } from '../data-source'
import { OAuthToken } from '../entities/oauth-token.entity'
import { TokenService } from '../services/token.service'
import { JwtService } from '@jmondi/oauth2-server'
import { JWT_SECRET } from '../constants'

const tokenRepository = mainDataSource.getRepository(OAuthToken)
const tokenService = new TokenService(tokenRepository)

/**
 * Verifies an access token and retrieves the user that owns it.  If the token is invalid, the
 * request will proceed without a user.
 *
 * @param request - the request object from Express
 * @param response - the response object from Express
 * @param next - the next function from Express
 */
export async function verifyToken(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const token = request.header('Authorization')?.slice('Bearer '.length)
  if (token) {
    const jwtService = new JwtService(JWT_SECRET)
    const { jti } = await jwtService.verify(token)

    // retrieve user from the DB using the token
    const user = await tokenService.getUserFromToken(jti as string)
    response.locals.user = user
  }

  // proceed no matter what, since some routes work with or without a token (different behavior)
  next()
}
