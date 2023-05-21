import Express from 'express'
import { validateChangePasswordRequest } from './validate-change-password-request'
import { HttpStatusCode } from '../enums/http-status-code.enum'

describe('validateChangePasswordRequest', () => {
  it('returns a HttpStatusCode.BadRequest if the password is not strong enough', () => {
    const mockRequest = {
      body: { plainTextPassword: 'password' },
    } as unknown as Express.Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    validateChangePasswordRequest(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Password is not strong enough' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('return a HttpStatusCode.BadRequest if the password field is missing, treating it as a weak password', () => {
    const mockRequest = {
      body: {},
    } as unknown as Express.Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    validateChangePasswordRequest(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Password is not strong enough' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next if the password is strong enough', () => {
    const mockRequest = {
      body: { plainTextPassword: 'password1234!' },
    } as unknown as Express.Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    validateChangePasswordRequest(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
})
