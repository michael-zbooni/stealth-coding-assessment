import { GenericException } from './generic.exception'

export class NotFoundException extends GenericException {
  constructor(message: string) {
    super(message, 404)
  }
}
