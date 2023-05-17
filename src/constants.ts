import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const SERVER_PORT = Number(process.env.PORT) || 3000

export const postgresConfig: Readonly<PostgresConnectionOptions> = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
}
