import {
  AuthorizationServer,
  DateInterval,
  JwtService,
  OAuthException,
  ResponseInterface,
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
import _ from 'lodash'
import { logger } from '../logger'

export class AuthController {
  private readonly authorizationServer: AuthorizationServer

  constructor(datasource: DataSource) {
    this.authorizationServer = new AuthorizationServer(
      new OAuthCodeRepository(datasource.getRepository(OAuthCode)),
      new OAuthClientRepository(datasource.getRepository(OAuthClient)),
      new OAuthTokenRepository(datasource.getRepository(OAuthToken)),
      new OAuthScopeRepository(datasource.getRepository(OAuthScope)),
      new OAuthUserRepository(datasource.getRepository(OAuthUser)),
      new JwtService(JWT_SECRET), // we're not using tokens generated by this actually
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
      const oauthResponse = (await this.authorizationServer.respondToAccessTokenRequest(
        request,
      )) as ResponseInterface & { accessToken: OAuthToken }
      // this officially-documented method responds with the JWT as the access_token instead of the
      // token generated and persisted in the DB, so we'll return the response manually
      // return handleExpressResponse(response, oauthResponse)

      response
        .status(200)
        .json(
          _.pick(oauthResponse.accessToken, [
            'accessToken',
            'accessTokenExpiresAt',
            'refreshToken',
            'refreshTokenExpiresAt',
          ]),
        )
    } catch (error) {
      // handleExpressError only handles OAuthExceptions and re-throws others
      logger.error('Error issuing a token', error)
      if (error instanceof OAuthException || error instanceof EntityNotFoundError) {
        // handleExpressError(error, response) // this one works but hard to control status code and message
        response.status(401).json({ error: 'Invalid credentials' })
      } else {
        response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}
