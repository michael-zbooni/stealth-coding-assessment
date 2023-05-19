import { Repository } from 'typeorm'
import {
  DateInterval,
  OAuthTokenRepository as OAuthTokenRepositoryInterface,
} from '@jmondi/oauth2-server'
import crypto from 'crypto'

import { OAuthClient } from '../entities/oauth-client.entity'
import { OAuthScope } from '../entities/oauth-scope.entity'
import { OAuthToken } from '../entities/oauth-token.entity'
import { OAuthUser } from '../entities/oauth-user.entity'

/**
 * This repository is used by the @jmondi/oauth2-server library to issue and revoke tokens.
 * It's required by the @jmondi/oauth2-server library.
 */
export class OAuthTokenRepository implements OAuthTokenRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthToken>) {}

  /**
   * Finds an OAuthToken entity by the access token itself.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2Token object.
   */
  async findByAccessToken(accessToken: string): Promise<OAuthToken> {
    return this.baseRepository.findOneOrFail({
      where: { accessToken },
      relations: {
        user: true,
      },
    })
  }

  /**
   * Issues an OAuth2 token.
   *
   * @param client - The OAuth2 client
   * @param scopes - The OAuth2 scopes
   * @param user - The OAuth2 user
   * @returns A promise that contains the OAuth2Token object.
   */
  async issueToken(
    client: OAuthClient,
    scopes: OAuthScope[],
    user?: OAuthUser,
  ): Promise<OAuthToken> {
    const token = new OAuthToken()
    token.accessToken = crypto.randomBytes(32).toString('base64url')
    token.accessTokenExpiresAt = new DateInterval('2h').getEndDate()
    token.client = client
    token.clientId = client.id
    token.user = user
    token.userId = user?.id
    token.scopes = []
    scopes.forEach((scope) => token.scopes.push(scope))
    return token
  }

  /**
   * Retrieves an OAuth2 access/bearer token by the refresh token.
   *
   * @param refreshToken - The OAuth2 refresh token
   * @returns A promise that contains the OAuth2Token object.
   */
  async getByRefreshToken(refreshToken: string): Promise<OAuthToken> {
    return this.baseRepository.findOneOrFail({
      where: { refreshToken },
      relations: {
        client: true,
        scopes: true,
        user: true,
      },
    })
  }

  /**
   * Determines if a refresh token has been revoked.
   *
   * @param token - The OAuth2 token
   * @returns A promise that contains a boolean indicating if the refresh token has been revoked.
   */
  async isRefreshTokenRevoked(token: OAuthToken): Promise<boolean> {
    return Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0)
  }

  /**
   * Issues a new refresh token.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2Token object.
   */
  async issueRefreshToken(accessToken: OAuthToken): Promise<OAuthToken> {
    accessToken.refreshToken = crypto.randomBytes(32).toString('base64url')
    accessToken.refreshTokenExpiresAt = new DateInterval('2h').getEndDate()
    return await this.baseRepository.save(accessToken)
  }

  /**
   * Persists an OAuth2 token to the database.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2Token object.
   */
  async persist(accessToken: OAuthToken): Promise<void> {
    await this.baseRepository.save(accessToken)
  }

  /**
   * Revokes an OAuth2 token.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2Token object.
   */
  async revoke(accessToken: OAuthToken): Promise<void> {
    accessToken.revoke()
    await this.baseRepository.save(accessToken)
  }
}
