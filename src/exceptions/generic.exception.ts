/**
 * A generic exception that also contains an HTTP status code.  It's not abstract so it can actually
 * be thrown in some cases.
 */
export class GenericException extends Error {
  constructor(message: string, public status = 500) {
    super(message)
    this.name = this.constructor.name
  }
}
