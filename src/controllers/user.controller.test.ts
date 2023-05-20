import { EntityNotFoundError, TypeORMError } from 'typeorm'
import { UserService } from '../services/user.service'
import { UserController } from './user.controller'
import Express from 'express'
import { OAuthUser } from '../entities/oauth-user.entity'
import { ConflictException } from '../exceptions/conflict.exception'
import { NotFoundException } from '../exceptions/not-found.exception'

describe('UserController', () => {
  const userService = {
    register: jest.fn(),
    activate: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn(),
    changePassword: jest.fn(),
  }
  const userController = new UserController(userService as unknown as UserService)

  describe('#register', () => {
    it('calls the service method (#register) correctly', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        plainTextPassword: 'password',
      }
      const request = {
        body: user,
      } as Express.Request

      userService.register.mockResolvedValue(user)

      await userController.register(request)
      expect(userService.register).toHaveBeenCalledWith(user)
    })

    it('throws a 409 on duplicate emails', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        plainTextPassword: 'password',
      }
      const request = {
        body: user,
      } as Express.Request

      userService.register.mockRejectedValue(
        Object.assign(new EntityNotFoundError(OAuthUser, {}), { message: 'duplicate key' }),
      )

      const actual = userController.register(request)
      await expect(actual).rejects.toThrow(ConflictException)
      expect(userService.register).toHaveBeenCalledWith(user)
    })

    it('rethrows any other error', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        plainTextPassword: 'password',
      }
      const request = {
        body: user,
      } as Express.Request

      userService.register.mockRejectedValue(new TypeORMError())

      const actual = userController.register(request)
      await expect(actual).rejects.toThrow(TypeORMError)
      expect(userService.register).toHaveBeenCalledWith(user)
    })
  })

  describe('#verify', () => {
    it('calls the service method (#activate) correctly', async () => {
      const request = {
        query: {
          token: 'activation-token',
        },
      } as unknown as Express.Request

      await userController.verify(request)
      expect(userService.activate).toHaveBeenCalledWith('activation-token')
    })
  })

  describe('#list', () => {
    it('calls the service method (#list) correctly for unauthenticated requests', async () => {
      const request = {
        query: {
          offset: 20,
          limit: 15,
        },
      } as unknown as Express.Request
      const response = { locals: {} } as Express.Response

      await userController.list(request, response)
      expect(userService.getUsers).toHaveBeenCalledWith({
        authenticated: false,
        offset: 20,
        limit: 15,
      })
    })

    it('calls the service method (#list) correctly for authenticated requests', async () => {
      const request = {
        query: {},
      } as unknown as Express.Request
      const response = { locals: { user: { id: 1 } } } as unknown as Express.Response

      await userController.list(request, response)
      expect(userService.getUsers).toHaveBeenCalledWith({
        authenticated: true,
        offset: undefined,
        limit: undefined,
      })
    })
  })

  describe('#getUser', () => {
    it('calls the service method (#getUser) correctly', async () => {
      const request = {
        params: {
          id: 1,
        },
      } as unknown as Express.Request
      const response = { locals: {} } as Express.Response

      await userController.getUser(request, response)
      expect(userService.getUser).toHaveBeenCalledWith({ userId: 1, authenticated: false })
    })

    it('calls the service method (#getUser) correctly for authenticated requests', async () => {
      const request = {
        params: {
          id: 1,
        },
      } as unknown as Express.Request
      const response = { locals: { user: { id: 1 } } } as unknown as Express.Response

      await userController.getUser(request, response)
      expect(userService.getUser).toHaveBeenCalledWith({ userId: 1, authenticated: true })
    })

    it('throws a 404 if the user is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
      } as unknown as Express.Request
      const response = { locals: {} } as Express.Response

      userService.getUser.mockRejectedValue(
        Object.assign(new EntityNotFoundError(OAuthUser, {}), { message: 'not found' }),
      )

      const actual = userController.getUser(request, response)
      await expect(actual).rejects.toThrow(NotFoundException)
      expect(userService.getUser).toHaveBeenCalledWith({ userId: 1, authenticated: false })
    })

    it('rethrows any other error', async () => {
      const request = {
        params: {
          id: 1,
        },
      } as unknown as Express.Request
      const response = { locals: {} } as Express.Response

      userService.getUser.mockRejectedValue(new TypeORMError())

      const actual = userController.getUser(request, response)
      await expect(actual).rejects.toThrow(TypeORMError)
      expect(userService.getUser).toHaveBeenCalledWith({ userId: 1, authenticated: false })
    })
  })

  describe('#changePassword', () => {
    it('calls the service method (#changePassword) correctly', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          plainTextPassword: 'new-password',
        },
        locals: {
          user: {
            id: 1,
          },
        },
      } as unknown as Express.Request

      await userController.changePassword(request)
      expect(userService.changePassword).toHaveBeenCalledWith(1, 'new-password')
    })

    it('throws a 404 if the user is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          plainTextPassword: 'new-password',
        },
        locals: {
          user: {
            id: 1,
          },
        },
      } as unknown as Express.Request

      userService.changePassword.mockRejectedValue(
        Object.assign(new EntityNotFoundError(OAuthUser, {}), { message: 'not found' }),
      )

      const actual = userController.changePassword(request)
      await expect(actual).rejects.toThrow(NotFoundException)
      expect(userService.changePassword).toHaveBeenCalledWith(1, 'new-password')
    })
  })
})
