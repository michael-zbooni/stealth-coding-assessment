import { Repository } from 'typeorm'
import { OAuthUser } from '../entities/oauth-user.entity'
import { compare, hash } from 'bcrypt'
import crypto from 'crypto'
import _ from 'lodash'
import { BCRYPT_ROUNDS, defaultPaginationLimits, BACKEND_URL } from '../config'
import { EmailService } from './email.service'
import { UserActivationException } from '../exceptions/user-activation.exception'
import { logger } from '../logger'
import { PasswordChangeException } from '../exceptions/password-change.exception'
import { CRYPTO_RANDOM_BYTES_LENGTH } from '../config'

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
  constructor(
    private readonly userRepository: Repository<OAuthUser>,
    private readonly emailService?: EmailService,
  ) {}

  /**
   * Omits sensitive data from the OAuthUser object.
   *
   * @param user - the complete OAuthUser object
   * @returns A new OAuthUser object with the sensitive data omitted
   */
  private omitSensitiveData(user: OAuthUser) {
    return _.omit(user, ['plainTextPassword', 'hashedPassword', 'activationToken'])
  }

  /**
   * Registers a new user.  This also sends a verification email to the user.
   *
   * @param user - the user to register
   * @returns A promise that resolves to the newly created user, minus the sensitive data
   */
  async register(
    user: RegisterUserDTO,
  ): Promise<Omit<OAuthUser, 'hashedPassword' | 'activationToken'>> {
    const { plainTextPassword, ...otherUserInfo } = user
    const newUserDTO = {
      ...otherUserInfo,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's not due to the validator
      hashedPassword: await hash(plainTextPassword!, BCRYPT_ROUNDS),
      activationToken: crypto.randomBytes(CRYPTO_RANDOM_BYTES_LENGTH).toString('base64url'),
    }

    const newUser = await this.userRepository.save(newUserDTO)

    // seeds don't need to send emails
    if (this.emailService) {
      const response = await this.emailService.sendVerificationEmail({
        toEmail: newUser.email,
        toName: newUser.firstName || 'there', // "Hello, Mike" or "Hello, there"
        activationLink: `${BACKEND_URL}/users/verify?token=${newUser.activationToken}`,
      })
      logger.info('Email response', response) // just log it for now
    }

    return this.omitSensitiveData(newUser)
  }

  /**
   * Activates a user's account.  If a token is invalid or the user is already active, an exception
   * is thrown.
   *
   * @param token - the activation token
   * @returns A promise that resolves to the activated user, minus the sensitive data
   */
  async activate(token: string) {
    const user = await this.userRepository.findOne({
      where: { activationToken: token },
    })

    if (!user) {
      throw new UserActivationException('Invalid activation token', 401)
    }

    if (user.active) {
      throw new UserActivationException('User is already active', 400)
    }

    user.active = true
    return this.userRepository.save(user).then(this.omitSensitiveData)
  }

  /**
   * Changes a user's password.  This is only available to authenticated users.
   *
   * @param userId - the user's id
   * @param newPassword - the new password
   * @returns A promise that resolves to the updated user, minus the sensitive data
   */
  async changePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId, active: true },
    })

    const sameAsOldPassword = await compare(newPassword, user.hashedPassword)
    if (sameAsOldPassword) {
      throw new PasswordChangeException('New password cannot be the same as the old password')
    }

    user.hashedPassword = await hash(newPassword, BCRYPT_ROUNDS)
    return this.userRepository.save(user).then(this.omitSensitiveData)
  }

  /**
   * Generates the select object for the user repository.  This is used to omit sensitive data
   * from the user object.
   *
   * @param authenticated - whether the user is authenticated
   * @returns The select object
   */
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

  /**
   * Gets a list of users.  The pagination is forced.  Only the first name is returned for
   * unauthenticated users.
   *
   * @param param0.authenticated - whether the user is authenticated
   * @param param0.limit - the limit of users to return
   * @param param0.offset - the offset of users to return
   * @returns A promise that resolves to a list of users, minus the sensitive data
   */
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

  /**
   * Gets a single user.  Only the first name is returned for unauthenticated users.
   *
   * @param param0.userId - the user's id
   * @param param0.authenticated - whether the user is authenticated
   * @returns A promise that resolves to the user, minus the sensitive data
   */
  async getUser({ userId, authenticated }: { userId: number; authenticated: boolean }) {
    return this.userRepository.findOneOrFail({
      where: { id: userId, active: true },
      select: this.generateSelect(authenticated),
    })
  }
}
