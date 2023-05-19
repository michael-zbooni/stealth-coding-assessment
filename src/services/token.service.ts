import { Repository } from 'typeorm'
import { OAuthToken } from '../entities/oauth-token.entity'
import { OAuthUser } from '../entities/oauth-user.entity'

/**
 * A service that provides methods for working with OAuth tokens.
 */
export class TokenService {
  constructor(private readonly tokenRepository: Repository<OAuthToken>) {}

  /**
   * Finds an OAuthToken entity by an access token.
   *
   * @param accessToken - The OAuth2 access/bearer token
   * @returns A promise that contains the OAuth2User object.
   */
  async getUserFromToken(accessToken: string): Promise<OAuthUser | undefined> {
    const token = await this.tokenRepository.findOne({
      where: { accessToken },
      relations: {
        user: true,
      },
    })
    return token?.user
  }
}
