import emailjs from '@emailjs/nodejs'
import { emailjsConfig } from '../constants'

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

export class EmailService {
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
