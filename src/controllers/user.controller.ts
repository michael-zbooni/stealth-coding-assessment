import Express from 'express'
import { UserService } from '../services/user.service'
import { EntityNotFoundError } from 'typeorm'
import { GenericException } from '../exceptions/generic.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import { Controller } from './controller'
import { OAuthUser } from '../entities/oauth-user.entity'

export type UnauthenticatedUserResponse = Pick<OAuthUser, 'firstName'>
export type AuthenticatedUserResponse = Omit<OAuthUser, 'hashedPassword' | 'activationToken'>

/**
 * Handles all /users routes.
 */
export class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super()
  }

  /**
   * Registers a new user.
   *
   * @param param0 - the request object from Express (destructured)
   * @param param0.body.firstName - the user's first name
   * @param param0.body.lastName - the user's last name
   * @param param0.body.email - the user's email
   * @param param0.body.plainTextPassword - the user's password
   *
   * @returns A promise that resolves to the newly created user, minus the sensitive data
   */
  async register({
    body: { firstName, lastName, email, plainTextPassword },
  }: Express.Request): Promise<Omit<OAuthUser, 'hashedPassword' | 'activationToken'>> {
    try {
      return await this.userService.register({
        firstName,
        lastName,
        email,
        plainTextPassword,
      })
    } catch (error) {
      if (error instanceof EntityNotFoundError && error.message.includes('duplicate key')) {
        throw new GenericException('Email already exists', 409)
      }
      throw error
    }
  }

  /**
   * Verifies a user's email address.
   *
   * @param param0 - the request object from Express (destructured)
   * @param param0.query.token - the verification token
   *
   * @returns A promise that resolves to the newly created user, with his/her active status set to true
   */
  async verify({
    query: { token },
  }: Express.Request): Promise<Omit<OAuthUser, 'hashedPassword' | 'activationToken'>> {
    return this.userService.activate(token as string) // query params can be of multiple types
  }

  /**
   * Gets a list of users, with forced pagination to not overload the server.
   *
   * @param param0 - the request object from Express (destructured)
   * @param param0.query.limit - the number of users to return
   * @param param0.query.offset - the number of users to skip
   *
   * @param param1 - the response object from Express (destructured)
   * @param param1.locals.user - the authenticated user (or undefined if not authenticated)
   *
   * @returns A promise that resolves to an array of users
   */
  async list(
    { query: { limit, offset } }: Express.Request,
    { locals: { user } }: Express.Response,
  ): Promise<AuthenticatedUserResponse[] | UnauthenticatedUserResponse[]> {
    return this.userService.getUsers({
      authenticated: Boolean(user),
      limit: Number(limit) || undefined, // fallback to default params if falsy
      offset: Number(offset) || undefined, // TODO: add tests since there's already a breakage
    })
  }

  /**
   * Gets a single user.
   *
   * @param param0 - the request object from Express (destructured)
   * @param param0.params.id - the user's ID
   *
   * @param param1 - the response object from Express (destructured)
   * @param param1.locals.user - the authenticated user (or undefined if not authenticated)
   *
   * @returns A promise that resolves to a single user
   */
  async getUser(
    { params: { id } }: Express.Request,
    { locals: { user } }: Express.Response,
  ): Promise<AuthenticatedUserResponse | UnauthenticatedUserResponse> {
    try {
      return await this.userService.getUser({ userId: Number(id), authenticated: Boolean(user) })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('User not found')
      }
      throw error
    }
  }

  /**
   * Changes a user's password.
   *
   * @param param0 - the request object from Express (destructured)
   * @param param0.params.id - the user's ID
   * @param param0.body.plainTextPassword - the user's new password
   *
   * @returns A promise that resolves to the updated user
   */
  async changePassword({
    params: { id },
    body: { plainTextPassword },
  }: Express.Request): Promise<AuthenticatedUserResponse> {
    try {
      return await this.userService.changePassword(Number(id), plainTextPassword)
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('User not found')
      }
      throw error
    }
  }
}
