import { OAuthUser } from '../entities/oauth-user.entity'
import { OAuthTokenRepository } from '../repositories/oauth-token.repository'

/**
 * A service that provides methods for working with OAuth tokens.
 */
export class TokenService {
  constructor(private readonly tokenRepository: OAuthTokenRepository) {}

  /**
   * Finds an OAuthToken entity by an access token.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2User object.
   */
  async getUserFromToken(accessToken: string): Promise<OAuthUser | undefined> {
    const token = await this.tokenRepository.findByAccessToken(accessToken)
    return token.isRevoked ? undefined : token?.user
  }
}
