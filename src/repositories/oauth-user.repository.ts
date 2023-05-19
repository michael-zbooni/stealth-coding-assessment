import { Repository } from 'typeorm'
import {
  ErrorType,
  ExtraAccessTokenFields,
  OAuthException,
  OAuthUserRepository as OAuthUserRepositoryInterface,
} from '@jmondi/oauth2-server'

import { OAuthUser } from '../entities/oauth-user.entity'
import { compare } from 'bcrypt'

export class OAuthUserRepository implements OAuthUserRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthUser>) {}

  async getUserByCredentials(identifier: string, plainTextPassword: string): Promise<OAuthUser> {
    const user = await this.baseRepository.findOneOrFail({
      where: { email: identifier, active: true },
    })

    // we do the bcrypt check here instead of user.service.ts as a constraint
    // from the OAuth2 server library
    const correctPassword = await compare(plainTextPassword, user.hashedPassword)

    if (!correctPassword) {
      throw new OAuthException('Invalid credentials', ErrorType.AccessDenied)
    }

    return user
  }

  async extraAccessTokenFields(_user: OAuthUser): Promise<ExtraAccessTokenFields | undefined> {
    return {}
  }
}
