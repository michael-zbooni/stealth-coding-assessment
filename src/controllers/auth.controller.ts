import {
  AuthorizationServer,
  DateInterval,
  JwtService,
  OAuthException,
  ResponseInterface,
} from '@jmondi/oauth2-server'
import { handleExpressResponse } from '@jmondi/oauth2-server/dist/adapters/express'

import { OAuthCodeRepository } from '../repositories/oauth-code.repository'
import { OAuthClientRepository } from '../repositories/oauth-client.repository'
import { OAuthTokenRepository } from '../repositories/oauth-token.repository'
import { OAuthScopeRepository } from '../repositories/oauth-scope.repository'
import { OAuthCode } from '../entities/oauth-code.entity'
import { OAuthClient } from '../entities/oauth-client.entity'
import { OAuthToken } from '../entities/oauth-token.entity'
import { OAuthScope } from '../entities/oauth-scope.entity'
import { OAuthUser } from '../entities/oauth-user.entity'
import { OAuthUserRepository } from '../repositories/oauth-user.repository'
import { DataSource, EntityNotFoundError } from 'typeorm'
import { JWT_SECRET } from '../constants'
import Express from 'express'
import _ from 'lodash'
import { logger } from '../logger'
import { Controller } from './controller'
import { UnauthorizedException } from '../exceptions/unauthorized.exception'

export type OAuthTokenResponse = Pick<
  OAuthToken,
  'accessToken' | 'accessTokenExpiresAt' | 'refreshToken' | 'refreshTokenExpiresAt'
>

/**
 * This controller handles the OAuth2 Password grant flow, since it's the flow required by the coding
 * exercise.  Other OAuth2 flows were removed.
 */
export class AuthController extends Controller {
  private readonly authorizationServer: AuthorizationServer

  constructor(datasource: DataSource) {
    super()
    this.authorizationServer = new AuthorizationServer(
      new OAuthCodeRepository(datasource.getRepository(OAuthCode)),
      new OAuthClientRepository(datasource.getRepository(OAuthClient)),
      new OAuthTokenRepository(datasource.getRepository(OAuthToken)),
      new OAuthScopeRepository(datasource.getRepository(OAuthScope)),
      new OAuthUserRepository(datasource.getRepository(OAuthUser)),
      new JwtService(JWT_SECRET),
    )
    this.authorizationServer.enableGrantTypes(
      // ['authorization_code', new DateInterval('15m')],
      ['password', new DateInterval('15m')],
      'refresh_token',
    )
  }

  // there WAS a PoC code here for the Authorization Code grant flow, but was
  // incomplete, and actually not needed for the coding exercise, and so was removed.
  // See this commit to revive: https://github.com/myknbani/stealth-coding-assessment/commit/3a5beb0

  /**
   * Issues tokens for the Password grant flow, or an access token for the Refresh Token grant flow.
   *
   * @param request - the request object from Express
   * @param _response - the response object from Express
   * @returns A promise that contains access and refresh tokens, and their expiry.
   */
  async issueToken(request: Express.Request, response: Express.Response): Promise<void> {
    try {
      const oauthResponse = await this.authorizationServer.respondToAccessTokenRequest(request)
      handleExpressResponse(response, oauthResponse)
    } catch (error) {
      // handleExpressError only handles OAuthExceptions and re-throws others
      logger.error('Error issuing a token', error)
      if (error instanceof OAuthException || error instanceof EntityNotFoundError) {
        // handleExpressError(error, response) // this one works but hard to control status code and message
        throw new UnauthorizedException('Invalid credentials')
      }
      throw error
    }
  }
}
