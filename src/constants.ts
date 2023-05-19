import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const SERVER_PORT = Number(process.env.PORT) || 3000

// no fallback secret to avoid accidents with missing env var
export const JWT_SECRET = process.env.JWT_SECRET

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10 // bcrypt library default

export const postgresConfig: Readonly<PostgresConnectionOptions> = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DATABASE || 'stealth_assessment',
}
