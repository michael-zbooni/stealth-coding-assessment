import { Repository } from 'typeorm'
import { OAuthToken } from '../entities/oauth-token.entity'

export class TokenService {
  constructor(private readonly tokenRepository: Repository<OAuthToken>) {}

  async getUserFromToken(accessToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { accessToken },
      relations: {
        user: true,
      },
    })
    return token?.user
  }
}
