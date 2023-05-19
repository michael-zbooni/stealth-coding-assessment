import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { OAuthScope } from '../entities/oauth-scope.entity'

/**
 * Seeds the oauth_scope table with a single scope.
 */
export default class OAuthScopeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(OAuthScope)
    await repository.insert([
      {
        name: 'profile',
        description: "Access to your or other users' profile",
      },
    ])
  }
}
