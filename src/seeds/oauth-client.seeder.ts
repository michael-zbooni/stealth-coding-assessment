import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { OAuthClient } from '../entities/oauth-client.entity'
import { v4 as uuidV4 } from 'uuid'

export default class OAuthClientSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(OAuthClient)
    await repository.insert([
      {
        id: uuidV4(),
        name: 'Some 3rd Party Confidential Backend',
        secret: 'some-client-secret',
        redirectUris: ['http://localhost:3000/oauth/callback'],
        allowedGrants: ['password'],
      },
      {
        id: '8a5e42d8-3d55-4e9b-a3f2-4fc92a83f7be',
        name: 'Some 3rd Party Public Backend',
        redirectUris: ['http://localhost:3000/oauth/callback'],
        allowedGrants: ['password'],
      },
    ])
  }
}
