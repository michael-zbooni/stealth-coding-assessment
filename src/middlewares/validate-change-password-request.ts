import Express from 'express'
import { isStrongPassword } from 'class-validator'

/**
 * Validates that the user's new password is strong enough.
 *
 * @param request - the request object from Express
 * @param response - the response object from Express
 * @param next - the next function from Express
 */
export function validateChangePasswordRequest(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction,
) {
  const { plainTextPassword } = request.body

  // TODO: we might want to get the user, and check if the new password is the same as the old one

  if (
    // TODO: configure the password-strength config in one place, or find a way to reuse OAuthUser validations
    isStrongPassword(plainTextPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return next()
  }

  return response.status(400).json({ error: 'Password is not strong enough' })
}
