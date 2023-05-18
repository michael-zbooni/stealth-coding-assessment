import { Repository } from 'typeorm'
import { OAuthUser } from '../entities/oauth-user.entity'
import { hash } from 'bcrypt'
import crypto from 'crypto'
import _ from 'lodash'

export type RegisterUserDTO = Pick<
  OAuthUser,
  'email' | 'firstName' | 'lastName'
> & { plainTextPassword: string }

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
    return _.omit(user, ['hashedPassword', 'activationToken'])
  }

  async register(
    user: RegisterUserDTO,
  ): Promise<Omit<OAuthUser, 'hashedPassword' | 'activationToken'>> {
    const { plainTextPassword, ...otherUserInfo } = user
    const newUserDTO = {
      ...otherUserInfo,
      hashedPassword: await hash(plainTextPassword, 10),
      activationToken: crypto.randomBytes(32).toString('base64url'),
    }
    const newUser = await this.userRepository.save<NewUser>(newUserDTO)
    return this.omitSensitiveData(newUser)
  }

  async activate(token: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { activationToken: token, active: false },
    })
    user.active = true
    const activeUser = await this.userRepository.save(user)
    return this.omitSensitiveData(activeUser)
  }

  async changePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId, active: true },
    })
    user.hashedPassword = await hash(newPassword, 10)
    const updatedUser = await this.userRepository.save(user)
    return this.omitSensitiveData(updatedUser)
  }
}
