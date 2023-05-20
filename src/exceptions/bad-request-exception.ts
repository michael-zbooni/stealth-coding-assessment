import { HttpStatusCode } from '../enums/http-status-code.enum'
import { GenericException } from './generic.exception'

export class BadRequestException extends GenericException {
  constructor(message?: string) {
    super(message || 'Bad request', HttpStatusCode.BadRequest)
  }
}
