import { UserService } from './user.service'
import { OAuthUser } from '../entities/oauth-user.entity'
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// TODO: put all mock classes in one place
class MockUserRepository extends Repository<OAuthUser> {
  constructor() {
    super(OAuthUser, {} as EntityManager)
  }

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

    it('returns a user with sensitive info redacted if the credentials are valid', () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      const actual = service.register({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        plainTextPassword: 'yahoo',
      })

      return expect(actual).resolves.toStrictEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        active: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      })
    })

    it('calls bcrypt with the plain text password password', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      await service.register({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        plainTextPassword: 'yahoo',
      })
      expect(bcrypt.hash).toHaveBeenCalledWith('yahoo', 10)
    })

    it('generates an activation token', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      await service.register({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        plainTextPassword: 'yahoo',
      })

      expect(crypto.randomBytes).toHaveBeenCalledWith(32)
    })

    it('calls the base repository with the correct arguments', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      await service.register({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        plainTextPassword: 'yahoo',
      })

      expect(baseRepositoryMock.save).toHaveBeenCalledWith({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        hashedPassword: 'some-bcrypt-hash',
        activationToken: 'i-am-a-very-sensitive-token',
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

    it('returns a user with sensitive info redacted if the credentials are valid', () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)

      const actual = service.activate('i-am-a-very-sensitive-token')

      return expect(actual).resolves.toStrictEqual({
        id: 1,
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
        active: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      })
    })

    it('calls the base repository with the correct arguments', async () => {
      baseRepositoryMock.save.mockResolvedValue(user)
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)

      await service.activate('i-am-a-very-sensitive-token')

      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          activationToken: 'i-am-a-very-sensitive-token',
          active: false,
        },
      })
    })

    it('does not save the user if the activation token is invalid', async () => {
      baseRepositoryMock.findOneOrFail.mockRejectedValue(
        new EntityNotFoundError('OAuthUser', {}),
      )

      await expect(
        service.activate('i-am-a-very-sensitive-token'),
      ).rejects.toThrow(EntityNotFoundError)

      expect(baseRepositoryMock.save).not.toHaveBeenCalled()
    })
  })
})
