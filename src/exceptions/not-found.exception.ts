import { GenericException } from './generic.exception'

/**
 * An exception that indicates that a resource was not found.
 */
export class NotFoundException extends GenericException {
  constructor(message: string) {
    super(message, 404)
  }
}
