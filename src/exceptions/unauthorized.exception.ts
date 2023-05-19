import { GenericException } from './generic.exception'

export class UnauthorizedException extends GenericException {
  constructor(message: string) {
    super(message, 401)
  }
}
