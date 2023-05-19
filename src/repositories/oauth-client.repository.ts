import { Repository } from 'typeorm'
import {
  GrantIdentifier,
  OAuthClientRepository as OAuthClientRepositoryInterface,
} from '@jmondi/oauth2-server'

import { OAuthClient } from '../entities/oauth-client.entity'

/**
 * This is a repository for OAuth2 clients.  It's required by the @jmondi/oauth2-server library.
 */
export class OAuthClientRepository implements OAuthClientRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthClient>) {}

  /**
   * Retrieves an OAuth2 client by its identifier.
   *
   * @param clientId - the client identifier
   * @returns A promise that contains the client.
   */
  async getByIdentifier(clientId: string): Promise<OAuthClient> {
    return this.baseRepository.findOneOrFail({
      where: { id: clientId },
      relations: { scopes: true }, // this does not do anything yet
    })
  }

  /**
   * Determines if an OAuth2 client is valid.
   *
   * @param grantType - the grant type (currently only password is supported)
   * @param client - the client
   * @param clientSecret - the client secret
   * @returns A promise that contains a boolean indicating if the client is valid.
   */
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
