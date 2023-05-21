import Express from 'express'
import { mainDataSource } from '../data-source'
import { OAuthToken } from '../entities/oauth-token.entity'
import { TokenService } from '../services/token.service'
import { JwtService } from '@jmondi/oauth2-server'
import { JWT_SECRET } from '../config'
import { logger } from '../logger'
import { TokenExpiredError } from 'jsonwebtoken'
import { OAuthTokenRepository } from '../repositories/oauth-token.repository'

const baseTokenRepository = mainDataSource.getRepository(OAuthToken)
const oauthTokenRepository = new OAuthTokenRepository(baseTokenRepository)
const tokenService = new TokenService(oauthTokenRepository)

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
    const jwtService = new JwtService(JWT_SECRET!)

    try {
      const { jti } = await jwtService.verify(token)

      // retrieve user from the DB using the token.  Normally JWTs are stateless, and they expire,
      // but here, the DB is the simplest strategy that tells us if the token is revoked ealier than
      // its expiration date.
      const user = await tokenService.getUserFromToken(jti as string)
      response.locals.user = user
    } catch (error) {
      logger.error('Error verifying JWT', error)

      if (error instanceof TokenExpiredError) {
        response.header(
          'WWW-Authenticate',
          'Bearer error="invalid_token", error_description="The access token expired"',
        )
      }
    }
  }

  // proceed no matter what, since some routes work with or without a token (different behavior)
  next()
}
