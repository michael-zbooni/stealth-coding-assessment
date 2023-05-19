import Express from 'express'

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
