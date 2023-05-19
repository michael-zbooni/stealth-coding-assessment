import Express from 'express'
import { UserService } from '../services/user.service'

export class UserController {
  constructor(private readonly userService: UserService) {}

  async register({ body: { firstName, lastName, email, password } }: Express.Request) {
    const newUser = await this.userService.register({
      firstName,
      lastName,
      email,
      plainTextPassword: password,
    })
    console.log('newUser', newUser)
    return newUser
  }

  async verify({ query: { token } }: Express.Request) {
    return this.userService.activate(token as string) // query params can be of multiple types
  }

  async list({ query: { limit = '10', offset = '0' } }: Express.Request) {
    return this.userService.getUsers({
      authenticated: false,
      limit: Number(limit),
      offset: Number(offset),
    })
  }

  async getUser({ params: { id } }: Express.Request) {
    return this.userService.getUser({ userId: Number(id), authenticated: false })
  }
}
