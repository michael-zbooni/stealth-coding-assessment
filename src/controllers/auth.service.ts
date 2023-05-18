import {
  AuthorizationServer,
  DateInterval,
  JwtService,
  OAuthException,
} from '@jmondi/oauth2-server'
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
import {
  requestFromExpress,
  handleExpressError,
  handleExpressResponse,
} from '@jmondi/oauth2-server/dist/adapters/express'

export class AuthController {
  private readonly authorizationServer: AuthorizationServer

  constructor(datasource: DataSource) {
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

  async issueToken(request: Express.Request, response: Express.Response) {
    try {
      const oauthResponse =
        await this.authorizationServer.respondToAccessTokenRequest(request)
      console.log('OAuthResponse', oauthResponse)
      return handleExpressResponse(response, oauthResponse)
    } catch (error: any) {
      // handleExpressError only handles OAuthExceptions and re-throws others
      if (error instanceof OAuthException) {
        handleExpressError(error, response)
      } else if (error instanceof EntityNotFoundError) {
        response.status(401).json({ error: 'Invalid credentials' })
      } else {
        response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}
