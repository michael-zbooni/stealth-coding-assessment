import Express from 'express'
import { UserService } from '../services/user.service'
import { OAuthUser } from '../entities/oauth-user.entity'

export class UserController {
  constructor(private readonly userService: UserService) {}

  async register({
    body: { firstName, lastName, email, password },
  }: Express.Request) {
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
}
