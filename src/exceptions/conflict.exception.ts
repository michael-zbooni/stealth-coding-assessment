import { GenericException } from './generic.exception'

export class ConflictException extends GenericException {
  constructor(message: string) {
    super(message, 409)
  }
}
