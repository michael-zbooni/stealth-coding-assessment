import Express from 'express'

/**
 * Remaps the `password` field to `plainTextPassword` for user registration and password change.
 *
 * @param request - the request object from Express
 * @param _response - the response object from Express
 * @param next - the next function from Express
 */
export default function remapPasswordField(
  request: Express.Request,
  _response: Express.Response,
  next: Express.NextFunction,
) {
  if (request.body.password) {
    request.body.plainTextPassword = request.body.password
    Reflect.deleteProperty(request.body, 'password')
  }

  next()
}
