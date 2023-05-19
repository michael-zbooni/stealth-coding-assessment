import Express from 'express'
import { UserService } from '../services/user.service'
import { EntityNotFoundError } from 'typeorm'
import { GenericException } from '../exceptions/generic.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import { Controller } from './controller'

export class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super()
  }

  async register({ body: { firstName, lastName, email, plainTextPassword } }: Express.Request) {
    try {
      const newUser = await this.userService.register({
        firstName,
        lastName,
        email,
        plainTextPassword,
      })
      return newUser
    } catch (error) {
      if (error instanceof EntityNotFoundError && error.message.includes('duplicate key')) {
        throw new GenericException('Email already exists', 409)
      }
      throw error
    }
  }

  async verify({ query: { token } }: Express.Request) {
    return this.userService.activate(token as string) // query params can be of multiple types
  }

  async list({ query: { limit, offset } }: Express.Request) {
    return this.userService.getUsers({
      authenticated: false,
      limit: Number(limit),
      offset: Number(offset),
    })
  }

  async getUser({ params: { id } }: Express.Request) {
    try {
      return await this.userService.getUser({ userId: Number(id), authenticated: false })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('User not found')
      }
      throw error
    }
  }

  async changePassword({ params: { id }, body: { plainTextPassword } }: Express.Request) {
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
