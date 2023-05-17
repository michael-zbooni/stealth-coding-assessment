import { In, Repository } from 'typeorm'
import { OAuthScopeRepository as OAuthScopeRepositoryInterface } from '@jmondi/oauth2-server'

import { OAuthScope } from '../entities/oauth-scope.entity'

export class OAuthScopeRepository implements OAuthScopeRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthScope>) {}

  async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
    return this.baseRepository.find({ where: { name: In([...scopeNames]) } })
  }

  async finalize(scopes: OAuthScope[]): Promise<OAuthScope[]> {
    return scopes
  }
}
