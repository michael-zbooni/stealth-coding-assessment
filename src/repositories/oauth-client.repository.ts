import { Repository } from 'typeorm'
import {
  GrantIdentifier,
  OAuthClientRepository as OAuthClientRepositoryInterface,
} from '@jmondi/oauth2-server'

import { OAuthClient } from '../entities/oauth-client.entity'

export class OAuthClientRepository implements OAuthClientRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthClient>) {}

  async getByIdentifier(clientId: string): Promise<OAuthClient> {
    return this.baseRepository.findOneOrFail({
      where: { id: clientId },
      relations: { scopes: true }, // this does not do anything yet
    })
  }

  async isClientValid(
    grantType: GrantIdentifier,
    client: OAuthClient,
    clientSecret?: string,
  ): Promise<boolean> {
    if (client.secret && client.secret !== clientSecret) {
      return false
    }
    return client.allowedGrants.includes(grantType)
  }
}
