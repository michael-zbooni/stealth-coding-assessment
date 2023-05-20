import 'dotenv/config' // needed for seeding

import { DataSource, DataSourceOptions } from 'typeorm'
import { DATABASE_URL } from './constants'
import { SeederOptions } from 'typeorm-extension'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import path from 'path'

/**
 * Creates a proper glob string for the seeder file(s) to run, based on the SEEDER_NAMES environment variable.
 *
 * @returns a glob string for the seeder file(s) to run
 */
function createSeederGlob() {
  const { SEEDER_NAMES = '' } = process.env
  const multipleSeeds = SEEDER_NAMES?.includes(',')

  // it doesn't treat {oauth-scope}.seeder.ts as a glob, so curlies only for multiple seeders
  if (multipleSeeds) {
    return `{${SEEDER_NAMES}}`
  }

  return SEEDER_NAMES ? `${SEEDER_NAMES}` : '*'
}

export const mainDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, './entities/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/**/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [],
  seeds: [path.join(__dirname, `./seeds/${createSeederGlob()}.seeder.ts`)],
} as DataSourceOptions & SeederOptions)
