import { GenericException } from './generic.exception'

export class UserActivationException extends GenericException {
  constructor(message: string, status = 500) {
    super(message, status)
  }
}
