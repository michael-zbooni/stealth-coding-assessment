import { OAuthToken } from '../entities/oauth-token.entity'
import { OAuthTokenRepository } from '../repositories/oauth-token.repository'
import { TokenService } from './token.service'

const oauthTokenRepository = {
  findByAccessToken: jest.fn(),
}

describe('TokenService', () => {
  const tokenService = new TokenService(oauthTokenRepository as unknown as OAuthTokenRepository)

  describe('getUserFromToken', () => {
    it('retrieves the user from the token', async () => {
      oauthTokenRepository.findByAccessToken.mockResolvedValue(
        Object.assign(new OAuthToken(), {
          accessToken: 'some-token',
          user: { id: 1, email: 'mike@gmail.com' },
          accessTokenExpiresAt: new Date(Date.now() + 60_000),
        }),
      )
      const user = await tokenService.getUserFromToken('access-token')
      expect(user).toStrictEqual({ id: 1, email: 'mike@gmail.com' })
    })

    it('returns undefined if the token is revoked', async () => {
      oauthTokenRepository.findByAccessToken.mockResolvedValue(
        Object.assign(new OAuthToken(), {
          accessToken: 'some-token',
          user: { id: 1, email: 'mike@gmail.com' },
          accessTokenExpiresAt: new Date(0), // we revoke tokens by expiring them
        }),
      )

      const user = await tokenService.getUserFromToken('access-token')
      expect(user).toBeUndefined()
    })
  })
})
