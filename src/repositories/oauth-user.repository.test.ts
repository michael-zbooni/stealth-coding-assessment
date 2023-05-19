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

    it('returns a user if the credentials are valid', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as MockValue)

      const actual = await repository.getUserByCredentials('mike@gmail.com', 'yahoo')
      expect(bcrypt.compare).toHaveBeenCalledWith('yahoo', 'some-bcrypt-hash')
      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'mike@gmail.com' },
      })
      expect(actual).toStrictEqual(user)
    })

    it('throws if the credentials are invalid', async () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as MockValue)
      const actual = repository.getUserByCredentials('mike@gmail.com', 'bahoo')

      await expect(actual).rejects.toThrowError(OAuthException)
      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'mike@gmail.com' },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('bahoo', 'some-bcrypt-hash')
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

    it('does not add extra fields to the OAuth bearer token (JWT)', async () => {
      const actual = await repository.extraAccessTokenFields(user)
      return expect(actual).toStrictEqual({})
    })
  })
})
