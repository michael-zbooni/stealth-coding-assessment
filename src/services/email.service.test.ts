import { EmailService } from './email.service'
import emailjs from '@emailjs/nodejs'
import 'jest-extended'

describe('EmailService', () => {
  describe('#sendVerificationEmail', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it('sends an email', async () => {
      const emailService = new EmailService()
      const sendSpy = jest.spyOn(emailjs, 'send').mockResolvedValue({ status: 200, text: 'OK' })

      const response = await emailService.sendVerificationEmail({
        toEmail: 'mike@gmail.com',
        toName: 'there',
        activationLink: 'http://localhost:3000/users/verify?token=123',
      })

      expect(sendSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        {
          to_name: 'there',
          to_email: 'mike@gmail.com',
          activation_link: 'http://localhost:3000/users/verify?token=123',
        },
        expect.objectContaining({
          publicKey: expect.toBeOneOf([expect.any(String), undefined]),
          privateKey: expect.toBeOneOf([expect.any(String), undefined]),
        }),
      )
    })
  })
})
