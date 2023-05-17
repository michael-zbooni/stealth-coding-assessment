import 'reflect-metadata'

import { DataSource, DataSourceOptions } from 'typeorm'
import { postgresConfig } from './constants'
import { OAuthUser } from './entities/oauth-user.entity'
import { OAuthClient } from './entities/oauth-client.entity'
import { OAuthScope } from './entities/oauth-scope.entity'
import { OAuthToken } from './entities/oauth-token.entity'
import { OAuthCode } from './entities/oauth-code.entity'
import { SeederOptions } from 'typeorm-extension'

export const mainDataSource = new DataSource({
  ...postgresConfig,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  seeds: ['src/seeds/**/*.seeder.ts'],
} as DataSourceOptions & SeederOptions)
