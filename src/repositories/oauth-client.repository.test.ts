import { OAuthClientRepository } from './oauth-client.repository'
import { OAuthClient } from '../entities/oauth-client.entity'
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm'

class MockRepository extends Repository<OAuthClient> {
  constructor() {
    super(OAuthClient, {} as EntityManager)
  }

  findOneOrFail = jest.fn()
}

const baseRepositoryMock = new MockRepository()

describe('OAuthClientRepository', () => {
  describe('#isClientValid', () => {
    const confidentialClient = Object.assign<OAuthClient, Partial<OAuthClient>>(new OAuthClient(), {
      allowedGrants: ['password'],
      id: 'some-client-id',
      name: 'Some Client',
      secret: 'some-secret',
    })
    const publicClient = Object.assign<OAuthClient, Partial<OAuthClient>>(new OAuthClient(), {
      allowedGrants: ['password'],
      id: 'some-client-id',
      name: 'Some Client',
    })
    const repository = new OAuthClientRepository(baseRepositoryMock)

    it('yields true if the client secret matches for confidential clients', () => {
      const actual = repository.isClientValid('password', confidentialClient, 'some-secret')
      expect(actual).resolves.toBe(true)
    })

    it('yields true if the client secret matches for confidential clients', () => {
      const actual = repository.isClientValid('password', confidentialClient, 'some-secret')
      expect(actual).resolves.toBe(true)
    })

    it('is true if the grant_type is recognized', () => {
      const actual = repository.isClientValid('password', publicClient)
      expect(actual).resolves.toBe(true)
    })
  })

  describe('#getByIdentifier', () => {
    const repository = new OAuthClientRepository(baseRepositoryMock)
    const client = Object.assign<OAuthClient, Partial<OAuthClient>>(new OAuthClient(), {
      allowedGrants: ['password'],
      id: 'some-client-id',
      name: 'Some Client',
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('yields the client if it exists', () => {
      baseRepositoryMock.findOneOrFail.mockResolvedValueOnce(client)
      const actual = repository.getByIdentifier('some-client-id')
      return expect(actual).resolves.toStrictEqual(client)
    })

    it('throws an error if the client does not exist', () => {
      baseRepositoryMock.findOneOrFail.mockRejectedValueOnce(
        new EntityNotFoundError('OAuthClient', 'some-client-id'),
      )
      const actual = repository.getByIdentifier('wrong-client-id')
      expect(actual).rejects.toThrowError(EntityNotFoundError)
    })

    it('calls the base repository with the correct arguments', async () => {
      await repository.getByIdentifier('some-client-id')
      expect(baseRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'some-client-id' },
        relations: { scopes: true },
      })
    })
  })
})
