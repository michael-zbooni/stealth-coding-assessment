import { Repository } from 'typeorm'
import {
  DateInterval,
  OAuthAuthCodeRepository as OAuthAuthCodeRepositoryInterface,
  generateRandomToken,
} from '@jmondi/oauth2-server'

import { OAuthCode } from '../entities/oauth-code.entity'
import { OAuthClient } from '../entities/oauth-client.entity'
import { OAuthScope } from '../entities/oauth-scope.entity'
import { OAuthUser } from '../entities/oauth-user.entity'

export class OAuthCodeRepository implements OAuthAuthCodeRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthCode>) {}

  getByIdentifier(authCodCode: string): Promise<OAuthCode> {
    return this.baseRepository.findOneOrFail({
      where: { code: authCodCode },
    })
  }

  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode)
    return authCode.isExpired
  }

  issueAuthCode(
    client: OAuthClient,
    user: OAuthUser | undefined,
    scopes: OAuthScope[],
  ) {
    const authCode = new OAuthCode()
    authCode.code = generateRandomToken()
    authCode.expiresAt = new DateInterval('15m').getEndDate()
    authCode.client = client
    authCode.clientId = client.id
    authCode.user = user
    authCode.userId = user?.id
    authCode.scopes = scopes
    return authCode
  }

  async persist(authCode: OAuthCode): Promise<void> {
    await this.baseRepository.save(authCode)
  }

  async revoke(authCodeCode: string): Promise<void> {
    const authCode = await this.getByIdentifier(authCodeCode)
    authCode.revoke()
    await this.baseRepository.save(authCode)
  }
}
