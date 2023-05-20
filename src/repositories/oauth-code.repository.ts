import { Repository } from 'typeorm'
import {
  DateInterval,
  OAuthAuthCodeRepository as OAuthAuthCodeRepositoryInterface,
} from '@jmondi/oauth2-server'

import crypto from 'crypto'
import { OAuthCode } from '../entities/oauth-code.entity'
import { OAuthClient } from '../entities/oauth-client.entity'
import { OAuthScope } from '../entities/oauth-scope.entity'
import { OAuthUser } from '../entities/oauth-user.entity'
import { tokenExpiration } from '../config'

const { AUTH_CODE: AUTH_CODE_EXPIRATION } = tokenExpiration

/**
 * This repository is used by the @jmondi/oauth2-server library to issue and revoke auth codes.
 * It's required by the @jmondi/oauth2-server library, but is currently not used, since the Password
 * grant type does not use them.
 *
 * @ignore - this is not used yet
 */
export class OAuthCodeRepository implements OAuthAuthCodeRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthCode>) {}

  /**
   * Retrieves an authorization code's details using the code itself.
   *
   * @param authCodCode - the authorization code
   * @returns a promise that contains the auth code
   */
  getByIdentifier(authCodCode: string): Promise<OAuthCode> {
    return this.baseRepository.findOneOrFail({
      where: { code: authCodCode },
    })
  }

  /**
   * Determines if an authorization code has been revoked.
   * @param authCodeCode - the authorization code
   * @returns a promise that contains a boolean indicating if the auth code has been revoked
   */
  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode)
    return authCode.isExpired
  }

  /**
   * Issues an authorization code that's needed in some of the OAuth2 flows.
   *
   * @param client - the OAuth2 client
   * @param user - the OAuth2 user
   * @param scopes - the OAuth2 scopes
   * @returns The issued auth code entity.
   */
  issueAuthCode(client: OAuthClient, user: OAuthUser | undefined, scopes: OAuthScope[]): OAuthCode {
    const authCode = new OAuthCode()
    authCode.code = crypto.randomBytes(32).toString('base64url')
    // has timezone issue, but not important (and actually unused) for this coding exercise
    authCode.expiresAt = new DateInterval(AUTH_CODE_EXPIRATION).getEndDate()
    authCode.client = client
    authCode.clientId = client.id
    authCode.user = user
    authCode.userId = user?.id
    authCode.scopes = scopes
    return authCode
  }

  /**
   * Persists an authorization code entity to the database.
   *
   * @param authCode - the auth code to persist
   */
  async persist(authCode: OAuthCode): Promise<void> {
    await this.baseRepository.save(authCode)
  }

  /**
   * Revokes an authorization code.
   *
   * @param authCodeCode - the authorization code
   * @returns a promise that resolves when the auth code has been revoked
   */
  async revoke(authCodeCode: string): Promise<void> {
    const authCode = await this.getByIdentifier(authCodeCode)
    authCode.revoke()
    await this.baseRepository.save(authCode)
  }
}
