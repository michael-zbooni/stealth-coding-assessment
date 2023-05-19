import { UserService } from './user.service'
import { OAuthUser } from '../entities/oauth-user.entity'
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

import { BCRYPT_ROUNDS, defaultPaginationLimits } from '../constants'
import fp from 'lodash/fp'
import _ from 'lodash'

type MockValue = never
const { USERS: USERS_DEFAULT_PAGINATION_LIMIT } = defaultPaginationLimits

// TODO: put all mock classes in one place
class MockUserRepository extends Repository<OAuthUser> {
  constructor() {
    super(OAuthUser, {} as EntityManager)
  }

  find = jest.fn()
  findOneOrFail = jest.fn()
  save = jest.fn()
}

const baseRepositoryMock = new MockUserRepository()

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('some-bcrypt-hash'),
}))
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue('i-am-a-very-sensitive-token'),
}))

describe('UserService', () => {
  describe('#register', () => {
    const service = new UserService(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: 1,
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      hashedPassword: 'i-am-a-very-sensitive-hash',
      activationToken: 'i-am-a-very-sensitive-token',
      active: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    } as OAuthUser)

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('hashes the password, generates an activation token, and redacts sensitive info', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      const actual = await service.register({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        plainTextPassword: 'yahoo',
      })

      expect(bcrypt.hash).toHaveBeenCalledWith('yahoo', BCRYPT_ROUNDS)
      expect(crypto.randomBytes).toHaveBeenCalledWith(32)
      expect(baseRepositoryMock.save).toHaveBeenCalledWith({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        hashedPassword: 'some-bcrypt-hash',
        activationToken: 'i-am-a-very-sensitive-token',
      })
      expect(actual).toStrictEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        active: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      })
    })
  })

  describe('#activate', () => {
    const service = new UserService(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: 1,
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      hashedPassword: 'i-am-a-very-sensitive-hash',
      activationToken: 'i-am-a-very-sensitive-token',
      active: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    } as OAuthUser)

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns a user with sensitive info redacted if the credentials are valid', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)

      const actual = await service.activate('i-am-a-very-sensitive-token')

      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          activationToken: 'i-am-a-very-sensitive-token',
          active: false,
        },
      })
      expect(actual).toStrictEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        active: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      })
    })

    it('does not save the user if the activation token is invalid', async () => {
      baseRepositoryMock.findOneOrFail.mockRejectedValue(new EntityNotFoundError('OAuthUser', {}))

      await expect(service.activate('i-am-an-incorrect-token')).rejects.toThrow(EntityNotFoundError)

      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          activationToken: 'i-am-an-incorrect-token',
          active: false,
        },
      })
      expect(baseRepositoryMock.save).not.toHaveBeenCalled()
    })
  })

  describe('#changePassword', () => {
    const service = new UserService(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: 1,
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      hashedPassword: 'i-am-a-very-sensitive-hash',
      activationToken: 'i-am-a-very-sensitive-token',
      active: true, // user should already be active when changing a password
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    } as OAuthUser)

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns the updated user with sensitive info redacted', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('some-new-bcrypt-hash' as MockValue)

      const actual = await service.changePassword(1, 'yabadabadoo')
      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 1,
          active: true,
        },
      })
      expect(bcrypt.hash).toHaveBeenCalledWith('yabadabadoo', BCRYPT_ROUNDS)
      expect(baseRepositoryMock.save).toHaveBeenCalledWith({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        hashedPassword: 'some-new-bcrypt-hash',
        activationToken: 'i-am-a-very-sensitive-token',
        active: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      })
      expect(actual).toStrictEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        active: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      })
    })
  })

  describe('#getUsers', () => {
    const service = new UserService(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: 1,
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    } as OAuthUser)
    const anotherUser = Object.assign(new OAuthUser(), {
      id: 2,
      email: 'richard@gmail.com',
      firstName: 'Richard',
      lastName: 'Yap',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    } as OAuthUser)

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns a list of users with complete info (minus sensitive info) if the request is authenticated', async () => {
      baseRepositoryMock.find.mockResolvedValue([user, anotherUser])

      const actual = await service.getUsers({ authenticated: true, limit: 5, offset: 15 })
      expect(baseRepositoryMock.find).toHaveBeenCalledWith({
        where: {
          active: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
          hashedPassword: false,
          activationToken: false,
        },
        take: 5,
        skip: 15,
      })

      // there are undefined values like hashedPassword, so toStrictEqual fails
      // https://jestjs.io/docs/expect#toequalvalue
      expect(actual).toEqual([
        {
          id: 1,
          email: 'mike@gmail.com',
          firstName: 'Mike',
          lastName: 'Coo',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        },

        {
          id: 2,
          email: 'richard@gmail.com',
          firstName: 'Richard',
          lastName: 'Yap',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        },
      ])
    })

    it('returns a list of users with first name only (minus sensitive info) if the request is unauthenticated', async () => {
      baseRepositoryMock.find.mockResolvedValue([user, anotherUser].map(fp.pick(['firstName'])))

      const actual = await service.getUsers({ authenticated: false })

      expect(baseRepositoryMock.find).toHaveBeenCalledWith({
        where: {
          active: true,
        },
        select: {
          id: false,
          email: false,
          firstName: true,
          lastName: false,
          createdAt: false,
          updatedAt: false,
          hashedPassword: false,
          activationToken: false,
        },
        take: USERS_DEFAULT_PAGINATION_LIMIT,
        skip: 0,
      })
      expect(actual).toStrictEqual([{ firstName: 'Mike' }, { firstName: 'Richard' }])
    })
  })

  describe('#getUser', () => {
    const service = new UserService(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: 1,
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    } as OAuthUser)

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns the user with complete info (minus sensitive info) if the request is authenticated', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)

      const actual = await service.getUser({ userId: 1, authenticated: true })

      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 1,
          active: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
          hashedPassword: false,
          activationToken: false,
        },
      })

      // there are undefined values like hashedPassword, so toStrictEqual fails
      // https://jestjs.io/docs/expect#toequalvalue
      expect(actual).toEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      })
    })

    it('returns the first name only if the request is unauthenticated', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(_.pick(user, ['firstName']))

      const actual = await service.getUser({ userId: 1, authenticated: false })
      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 1,
          active: true,
        },
        select: {
          id: false,
          email: false,
          firstName: true,
          lastName: false,
          createdAt: false,
          updatedAt: false,
          hashedPassword: false,
          activationToken: false,
        },
      })

      expect(actual).toStrictEqual({ firstName: 'Mike' })
    })
  })
})
