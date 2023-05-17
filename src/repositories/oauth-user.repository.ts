import { Repository } from 'typeorm'
import {
  ExtraAccessTokenFields,
  OAuthUserRepository as OAuthUserRepositoryInterface,
} from '@jmondi/oauth2-server'

import { OAuthUser } from '../entities/oauth-user.entity'

export class OAuthUserRepository implements OAuthUserRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthUser>) {}

  async getUserByCredentials(identifier: number): Promise<OAuthUser> {
    return this.baseRepository.findOneOrFail({
      where: { id: identifier },
    })
  }

  async extraAccessTokenFields(
    user: OAuthUser,
  ): Promise<ExtraAccessTokenFields | undefined> {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}
