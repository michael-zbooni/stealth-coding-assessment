import 'reflect-metadata'

import { DataSource, DataSourceOptions } from 'typeorm'
import { postgresConfig } from './constants'
import { SeederOptions } from 'typeorm-extension'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

function createSeederGlob() {
  const { SEEDER_NAMES = '' } = process.env
  const multipleSeeds = SEEDER_NAMES?.includes(',')

  // it doesn't treat {oauth-scope}.seeder.ts as a glob, so curlies only for multiple seeders
  if (multipleSeeds) {
    return `{${SEEDER_NAMES}}`
  }

  return SEEDER_NAMES ? `${SEEDER_NAMES}` : '*'
}

console.log('foo', `src/seeds/${createSeederGlob()}.seeder.ts`)

export const mainDataSource = new DataSource({
  ...postgresConfig,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [],
  seeds: [`src/seeds/${createSeederGlob()}.seeder.ts`],
} as DataSourceOptions & SeederOptions)
