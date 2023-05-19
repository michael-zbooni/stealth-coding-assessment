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

export class OAuthTokenRepository implements OAuthTokenRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthToken>) {}

  async findByAccessToken(accessToken: string): Promise<OAuthToken> {
    return this.baseRepository.findOneOrFail({
      where: { accessToken },
      relations: {
        user: true,
      },
    })
  }

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

  async isRefreshTokenRevoked(token: OAuthToken): Promise<boolean> {
    return Date.now() > (token.refreshTokenExpiresAt?.getTime() ?? 0)
  }

  async issueRefreshToken(accessToken: OAuthToken): Promise<OAuthToken> {
    accessToken.refreshToken = crypto.randomBytes(32).toString('base64url')
    accessToken.refreshTokenExpiresAt = new DateInterval('2h').getEndDate()
    return await this.baseRepository.save(accessToken)
  }

  async persist(accessToken: OAuthToken): Promise<void> {
    await this.baseRepository.save(accessToken)
  }

  async revoke(accessToken: OAuthToken): Promise<void> {
    accessToken.revoke()
    await this.baseRepository.save(accessToken)
  }
}
