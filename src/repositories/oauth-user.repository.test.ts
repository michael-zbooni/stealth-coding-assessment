import { OAuthUserRepository } from './oauth-user.repository'
import { OAuthUser } from '../entities/oauth-user.entity'
import { EntityManager, Repository } from 'typeorm'
import bcrypt from 'bcrypt'
import { OAuthException } from '@jmondi/oauth2-server'

type MockValue = never

class MockUserRepository extends Repository<OAuthUser> {
  constructor() {
    super(OAuthUser, {} as EntityManager)
  }

  findOneOrFail = jest.fn()
}

const baseRepositoryMock = new MockUserRepository()

describe('OAuthAuthCodeRepository', () => {
  describe('#getUserByCredentials', () => {
    const repository = new OAuthUserRepository(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: '1',
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      hashedPassword: 'some-bcrypt-hash',
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns a user if the credentials are valid', () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as MockValue)
      const actual = repository.getUserByCredentials('mike@gmail.com', 'yahoo')
      return expect(actual).resolves.toStrictEqual(user)
    })

    it('returns a user if the credentials are invalid', () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as MockValue)
      const actual = repository.getUserByCredentials('mike@gmail.com', 'bahoo')
      return expect(actual).rejects.toThrowError(OAuthException)
    })

    it('calls the base repository with the correct arguments', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as MockValue)
      await repository.getUserByCredentials('mike@gmail.com', 'yahoo')

      return expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'mike@gmail.com' },
      })
    })

    it('calls the bcrypt.compare with the correct arguments', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as MockValue)
      await repository.getUserByCredentials('mike@gmail.com', 'yahoo')

      return expect(bcrypt.compare).toHaveBeenCalledWith(
        'yahoo',
        'some-bcrypt-hash',
      )
    })
  })

  describe('#extraAccessTokenFields', () => {
    const repository = new OAuthUserRepository(baseRepositoryMock)
    const user = Object.assign(new OAuthUser(), {
      id: '1',
      email: 'mike@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
    })

    it('adds extra fields to the OAuth bearer token (JWT)', async () => {
      const actual = await repository.extraAccessTokenFields(user)
      return expect(actual).toStrictEqual({
        email: 'mike@gmail.com',
        firstName: 'Mike',
        lastName: 'Coo',
      })
    })
  })
})
