export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
export const SERVER_PORT = Number(process.env.PORT) || 3000
export const JWT_SECRET = process.env.JWT_SECRET
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10 // bcrypt library default

export const defaultPaginationLimits = Object.freeze({
  DEFAULT: 20,
  USERS: 20,
})

export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres'

export const emailjsConfig = Object.freeze({
  publicKey: process.env.EMAILJS_PUBLIC_KEY, // no fallback, be sure to put these in .env
  privateKey: process.env.EMAILJS_PRIVATE_KEY, // no fallback, be sure to put these in .env
  serviceId: process.env.EMAILJS_SERVICE_ID ?? 'service_vuq08vk',
  templates: {
    activation: process.env.EMAILJS_TEMPLATE_ACTIVATION ?? 'template_q0ob4ri',
  },
})

// TODO: add constants for date intervals, HTTP status code, password strength params, etc
