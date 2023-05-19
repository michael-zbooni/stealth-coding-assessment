import { GenericException } from './generic.exception'

/**
 * An exception that indicates that an operation was not authorized (more accurately: not authenticated).
 */
export class UnauthorizedException extends GenericException {
  constructor(message: string) {
    super(message, 401)
  }
}
