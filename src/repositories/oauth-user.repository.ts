import { Repository } from 'typeorm'
import {
  ErrorType,
  ExtraAccessTokenFields,
  OAuthException,
  OAuthUserRepository as OAuthUserRepositoryInterface,
} from '@jmondi/oauth2-server'

import { OAuthUser } from '../entities/oauth-user.entity'
import { compare } from 'bcrypt'

/**
 * This repository is used by the @jmondi/oauth2-server library to authenticate users.
 * It's required by the @jmondi/oauth2-server library.
 */
export class OAuthUserRepository implements OAuthUserRepositoryInterface {
  constructor(private readonly baseRepository: Repository<OAuthUser>) {}

  /**
   * Finds an OAuthUser entity by the user's credentials (email and password).
   * @param identifier - The user's email address
   * @param plainTextPassword - The user's password
   * @returns A promise that contains the OAuthUser object, or rejects if the credentials are invalid.
   */
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

  /**
   * Adds extra fields to the JWT.  Currently we don't add any.
   */
  async extraAccessTokenFields(_user: OAuthUser): Promise<ExtraAccessTokenFields | undefined> {
    return {}
  }
}
