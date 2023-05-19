import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const API_URL = process.env.API_URL || 'http://localhost:3000'

export const SERVER_PORT = Number(process.env.PORT) || 3000

// no fallback secret to avoid accidents with missing env var
export const JWT_SECRET = process.env.JWT_SECRET

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10 // bcrypt library default

export const defaultPaginationLimits = Object.freeze({
  DEFAULT: 20,
  USERS: 20,
})

export const postgresConfig: Readonly<PostgresConnectionOptions> = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DATABASE || 'stealth_assessment',
}

export const emailjsConfig = Object.freeze({
  publicKey: process.env.EMAILJS_PUBLIC_KEY, // no fallback, be sure to put these in .env
  privateKey: process.env.EMAILJS_PRIVATE_KEY, // no fallback, be sure to put these in .env
  serviceId: process.env.EMAILJS_SERVICE_ID ?? 'service_vuq08vk',
  templates: {
    activation: process.env.EMAILJS_TEMPLATE_ACTIVATION ?? 'template_q0ob4ri',
  },
})
