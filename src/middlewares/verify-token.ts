import Express from 'express'
import { mainDataSource } from '../data-source'
import { OAuthToken } from '../entities/oauth-token.entity'
import { TokenService } from '../services/token.service'

const tokenRepository = mainDataSource.getRepository(OAuthToken)
const tokenService = new TokenService(tokenRepository)

export async function verifyToken(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const token = request.header('Authorization')?.slice('Bearer '.length)
  ///////////////////////////////////////// TRADEOFF note /////////////////////////////////////////
  // OAuth 2.0 doesn’t define a specific format for Access Tokens, see:
  // https://auth0.com/intro-to-iam/what-is-oauth-2, also there's an issue in OAuthTokenRepository
  // where it persists a different token (a crypto-random one) but issues a JWT
  ///////////////////////////////////////// TRADEOFF note /////////////////////////////////////////
  if (token) {
    // retrieve user from the DB using the token
    const user = await tokenService.getUserFromToken(token as string)
    response.locals.user = user
  }

  // proceed no matter what, since some routes work with or without a token (different behavior)
  next()
}
