export class UserActivationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserServiceException'
  }
}
