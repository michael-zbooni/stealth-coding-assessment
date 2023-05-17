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

export class AuthService {
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
      ['authorization_code', new DateInterval('15m')],
      'refresh_token',
    )
  }

  async temporary(request: Express.Request, response: Express.Response) {
    try {
      const authRequest =
        await this.authorizationServer.validateAuthorizationRequest(
          requestFromExpress(request),
        )

      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      // Once the user has logged in set the user on the AuthorizationRequest
      console.log(
        'Once the user has logged in set the user on the AuthorizationRequest',
      )
      authRequest.user = { id: 1, email: 'richard.michael.coo@gmail.com' }

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      authRequest.isAuthorizationApproved = true

      // Return the HTTP redirect response
      const oauthResponse =
        await this.authorizationServer.completeAuthorizationRequest(authRequest)

      return handleExpressResponse(response, oauthResponse)
    } catch (error: any) {
      // this re-throws the error that are not of type OAuthException, see the source code:
      // https://github.com/jasonraimondi/ts-oauth2-server/blob/26ca01416bee1396235eb7e18b00d724b88560ae/src/adapters/express.ts#LL26C17-L26C35
      if (error instanceof OAuthException) {
        handleExpressError(error, response)
      } else if (error instanceof EntityNotFoundError) {
        response.status(401).json({ error: 'Invalid client ID.' })
      } else {
        response.status(500).json({ error: 'Internal server error.' })
      }
    }
  }

  async tokenTemporary(request: Express.Request, response: Express.Response) {
    try {
      const oauthResponse =
        await this.authorizationServer.respondToAccessTokenRequest(request)
      return handleExpressResponse(response, oauthResponse)
    } catch (error: any) {
      handleExpressError(error, response)
    }
  }
}
