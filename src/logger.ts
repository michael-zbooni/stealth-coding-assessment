import winston from 'winston'
import util from 'util'

/**
 * A transform function that makes Winston log functions behave like console.log
 *
 * @param info - info to transform
 * @returns The transformed info
 */
function transform(info: winston.Logform.TransformableInfo) {
  const args = info[Symbol.for('splat')]
  if (args) {
    info.message = util.formatWithOptions({ colors: true, depth: 5 }, info.message, ...args)
  }
  return info
}

/**
 * Creates a Winston formatter that makes log functions behave like console.log
 *
 * @returns A Winston formatter
 */
function utilFormatter() {
  return { transform }
}

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
})

// prevent Winston from being noisy in tests
const localDev = !['production', 'test'].includes(process.env.NODE_ENV || '')
if (localDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        utilFormatter(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`
        }),
      ),
    }),
  )
}
