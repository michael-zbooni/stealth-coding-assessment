import { GenericException } from './generic.exception'

export class PasswordChangeException extends GenericException {
  constructor(message: string) {
    super(message, 400)
  }
}
