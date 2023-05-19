import { Repository } from 'typeorm'
import { OAuthUser } from '../entities/oauth-user.entity'
import { hash } from 'bcrypt'
import crypto from 'crypto'
import _ from 'lodash'
import { BCRYPT_ROUNDS, defaultPaginationLimits } from '../constants'

const { USERS: USERS_DEFAULT_PAGINATION_LIMIT } = defaultPaginationLimits

export type RegisterUserDTO = Pick<
  OAuthUser,
  'email' | 'firstName' | 'lastName' | 'plainTextPassword'
>

export type NewUser = Omit<RegisterUserDTO, 'plainTextPassword'> &
  Pick<OAuthUser, 'hashedPassword' | 'activationToken'>

/**
 * This service is responsible for handling user registration, activation,
 * password change, and retrieving a single or multiple users for both authenticated
 * and unauthenticated users.  Login is part of OAuth and is "untuitively" handled
 * in oauth-user.repository.ts.
 */
export class UserService {
  constructor(private readonly userRepository: Repository<OAuthUser>) {}

  private omitSensitiveData(user: OAuthUser) {
    return _.omit(user, ['plainTextPassword', 'hashedPassword', 'activationToken'])
  }

  async register(
    user: RegisterUserDTO,
  ): Promise<Omit<OAuthUser, 'hashedPassword' | 'activationToken'>> {
    const { plainTextPassword, ...otherUserInfo } = user
    const newUserDTO = {
      ...otherUserInfo,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's not due to the validator
      hashedPassword: await hash(plainTextPassword!, BCRYPT_ROUNDS),
      activationToken: crypto.randomBytes(32).toString('base64url'),
    }
    return this.userRepository.save(newUserDTO).then(this.omitSensitiveData)
  }

  async activate(token: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { activationToken: token, active: false },
    })
    user.active = true
    return this.userRepository.save(user).then(this.omitSensitiveData)
  }

  async changePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId, active: true },
    })
    user.hashedPassword = await hash(newPassword, BCRYPT_ROUNDS)
    return this.userRepository.save(user).then(this.omitSensitiveData)
  }

  private generateSelect(authenticated: boolean) {
    return {
      id: authenticated,
      email: authenticated,
      firstName: true,
      lastName: authenticated,
      createdAt: authenticated,
      updatedAt: authenticated,
      hashedPassword: false,
      activationToken: false,
    }
  }

  async getUsers({
    authenticated = false,
    limit = USERS_DEFAULT_PAGINATION_LIMIT,
    offset = 0,
  }: {
    authenticated: boolean
    limit?: number
    offset?: number
  }) {
    return this.userRepository.find({
      where: { active: true },
      select: this.generateSelect(authenticated),
      take: limit,
      skip: offset,
    })
  }

  async getUser({ userId, authenticated }: { userId: number; authenticated: boolean }) {
    return this.userRepository.findOneOrFail({
      where: { id: userId, active: true },
      select: this.generateSelect(authenticated),
    })
  }
}
