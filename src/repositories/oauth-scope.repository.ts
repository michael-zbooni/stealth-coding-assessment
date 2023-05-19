import { In, Repository } from 'typeorm'
import { OAuthScopeRepository as OAuthScopeRepositoryInterface } from '@jmondi/oauth2-server'

import { OAuthScope } from '../entities/oauth-scope.entity'

/**
 * This is a repository for OAuth2 scopes.  It's required by the @jmondi/oauth2-server library.
 * It's currently not used, since the coding exercise does not explicitly require scopes.
 *
 * @ignore - this is not used yet
 */
export class OAuthScopeRepository implements OAuthScopeRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthScope>) {}

  /**
   * Retrieves all scopes by their identifiers.
   * @param scopeNames - the scope names
   * @returns A promise that contains the scopes.
   */
  async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
    return this.baseRepository.find({ where: { name: In([...scopeNames]) } })
  }

  /**
   * Finalizes the scopes.  Currently this does nothing.
   *
   * @param scopes - the scopes
   * @returns A promise that contains the adjusted scopes.
   */
  async finalize(scopes: OAuthScope[]): Promise<OAuthScope[]> {
    return scopes
  }
}
