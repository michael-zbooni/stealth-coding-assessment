import { DataSource, DataSourceOptions } from 'typeorm'
import { DATABASE_URL } from './constants'
import { SeederOptions } from 'typeorm-extension'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import path from 'path'

function createSeederGlob() {
  const { SEEDER_NAMES = '' } = process.env
  const multipleSeeds = SEEDER_NAMES?.includes(',')

  // it doesn't treat {oauth-scope}.seeder.ts as a glob, so curlies only for multiple seeders
  if (multipleSeeds) {
    return `{${SEEDER_NAMES}}`
  }

  return SEEDER_NAMES ? `${SEEDER_NAMES}` : '*'
}

console.log('foo', `./seeds/${createSeederGlob()}.seeder.ts`)

export const mainDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, './entities/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/**/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [],
  seeds: [`./seeds/${createSeederGlob()}.seeder.ts`],
} as DataSourceOptions & SeederOptions)
