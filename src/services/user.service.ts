import { Repository } from 'typeorm'
import { OAuthUser } from '../entities/oauth-user.entity'
import { hash } from 'bcrypt'

export type RegisterUserDTO = Pick<
  OAuthUser,
  'email' | 'firstName' | 'lastName'
> & { plainTextPassword: string }

export class UserService {
  constructor(private readonly userRepository: Repository<OAuthUser>) {}

  async register(user: RegisterUserDTO) {
    // some varying opinions where to place this, but went with https://softwareengineering.stackexchange.com/a/316845
    const { plainTextPassword, ...otherUserInfo } = user
    return this.userRepository.save({
      ...otherUserInfo,
      hashedPassword: await hash(plainTextPassword, 10),
    })
  }
}
