import { IsStrongPasswordOptions } from 'class-validator'

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
export const SERVER_PORT = Number(process.env.PORT) || 3000
export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
export const JWT_SECRET = process.env.JWT_SECRET
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10 // bcrypt library default
export const CRYPTO_RANDOM_BYTES_LENGTH = 32 // 256 bits

export const defaultPaginationLimits = Object.freeze({
  DEFAULT: 20,
  USERS: 20,
})

export const emailjsConfig = Object.freeze({
  publicKey: process.env.EMAILJS_PUBLIC_KEY, // no fallback, be sure to put these in .env
  privateKey: process.env.EMAILJS_PRIVATE_KEY, // no fallback, be sure to put these in .env

  // make sure these are in .env as well, these fallbacks only work for my own EmailJS account
  serviceId: process.env.EMAILJS_SERVICE_ID ?? 'service_vuq08vk',
  templates: {
    activation: process.env.EMAILJS_TEMPLATE_ACTIVATION ?? 'template_q0ob4ri',
  },
})

export const tokenExpiration = Object.freeze({
  ACCESS_TOKEN: '15m', // 15 minutes
  REFRESH_TOKEN: '30d', // 30 days
  AUTH_CODE: '15m', // 15 minutes
  // TODO: add for other types of tokens (e.g. email verification)
})

export const passwordStrengthConfig: Readonly<IsStrongPasswordOptions> = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 0,
  minNumbers: 1,
  minSymbols: 1,
}
