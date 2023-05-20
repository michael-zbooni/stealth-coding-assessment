import emailjs from '@emailjs/nodejs'
import { emailjsConfig } from '../config'

const {
  publicKey: EMAIL_JS_PUBLIC_KEY,
  privateKey: EMAIL_JS_PRIVATE_KEY,
  serviceId: EMAIL_JS_SERVICE_ID,
  templates: { activation: EMAIL_JS_ACTIVATION_TEMPLATE_ID },
} = emailjsConfig

interface ActivationEmailParams {
  toEmail: string
  toName: string
  activationLink: string
}

/**
 * A service that sends emails.  The implementation is currently using emailjs, but this could be
 * swapped out for another service.
 */
export class EmailService {
  /**
   * Sends an email to a user to activate their account.
   * @param param0.toEmail - The email address to send the email to.
   * @param param0.toName - The name of the user to send the email to.
   * @param param0.activationLink - The link that the user should click to activate their account.
   * @returns A promise that resolves when the email is sent.
   */
  async sendVerificationEmail({ toEmail, toName, activationLink }: ActivationEmailParams) {
    const templateParams = {
      to_name: toName,
      to_email: toEmail,
      link: activationLink,
    }

    const response = await emailjs.send(
      EMAIL_JS_SERVICE_ID,
      EMAIL_JS_ACTIVATION_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAIL_JS_PUBLIC_KEY!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        privateKey: EMAIL_JS_PRIVATE_KEY!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      },
    )

    return response
  }
}
