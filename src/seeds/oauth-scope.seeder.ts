import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { OAuthScope } from '../entities/oauth-scope.entity'

export default class OAuthScopeSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(OAuthScope)
    await repository.insert([
      {
        name: 'profile',
        description: "Access to your or other users' profile",
      },
    ])
  }
}
