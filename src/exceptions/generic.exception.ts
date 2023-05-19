export class GenericException extends Error {
  constructor(message: string, public status = 500) {
    super(message)
    this.name = this.constructor.name
  }
}
