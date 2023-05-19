import { GenericException } from './generic.exception'

/**
 * An exception that indicates that a user activation failed.
 */
export class UserActivationException extends GenericException {
  constructor(message: string, status = 400) {
    super(message, status)
  }
}
