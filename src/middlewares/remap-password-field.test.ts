import Express from 'express'
import { remapPasswordField } from './remap-password-field'

describe('remapPasswordField', () => {
  it('remaps the password field to plainTextPassword', () => {
    const mockRequest = {
      body: { password: 'password' },
    } as unknown as Express.Request
    const mockResponse = {} as Express.Response
    const mockNext = jest.fn()

    remapPasswordField(mockRequest, mockResponse, mockNext)

    expect(mockRequest.body).toStrictEqual({ plainTextPassword: 'password' })
    expect(mockNext).toHaveBeenCalled()
  })

  it('does not remap the password field if it does not exist', () => {
    const mockRequest = {
      body: { someOtherThing: 'some-data' },
    } as unknown as Express.Request
    const mockResponse = {} as Express.Response
    const mockNext = jest.fn()

    remapPasswordField(mockRequest, mockResponse, mockNext)

    expect(mockRequest.body).toStrictEqual({ someOtherThing: 'some-data' })
    expect(mockNext).toHaveBeenCalled()
  })
})
