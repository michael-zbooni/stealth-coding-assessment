import Express from 'express'
import { verifyToken } from './verify-token'
import { JwtService } from '@jmondi/oauth2-server'
import { TokenService } from '../services/token.service'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

describe('verifyToken', () => {
  const oldVerify = JwtService.prototype.verify
  const oldGetUserFromToken = TokenService.prototype.getUserFromToken

  beforeEach(() => {
    JwtService.prototype.verify = jest.fn().mockResolvedValue({ jti: 'some-jti' })
    TokenService.prototype.getUserFromToken = jest
      .fn()
      .mockResolvedValue({ id: 1, email: 'mike@gmail.com' })
  })

  afterEach(() => {
    jest.clearAllMocks()
    JwtService.prototype.verify = oldVerify
    TokenService.prototype.getUserFromToken = oldGetUserFromToken
  })

  it('sets a user for valid tokens', async () => {
    const mockRequest = {
      header: jest.fn().mockReturnValue('Bearer some-token'),
    } as unknown as Express.Request
    const mockResponse = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    await verifyToken(mockRequest, mockResponse, mockNext)

    expect(JwtService.prototype.verify).toHaveBeenCalledWith('some-token')
    expect(mockResponse.locals.user).toEqual({ id: 1, email: 'mike@gmail.com' })
    expect(mockNext).toHaveBeenCalled()
  })

  it('still proceeds for invalid tokens', async () => {
    const mockRequest = {
      header: jest.fn().mockReturnValue('Bearer some-token'),
    } as unknown as Express.Request
    const mockResponse = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    JwtService.prototype.verify = jest
      .fn()
      .mockRejectedValue(new JsonWebTokenError('Invalid signature'))

    await verifyToken(mockRequest, mockResponse, mockNext)

    expect(JwtService.prototype.verify).toHaveBeenCalledWith('some-token')
    expect(mockResponse.locals.user).toBeUndefined()
    expect(mockNext).toHaveBeenCalled()
  })

  it('adds a header for expired tokens', async () => {
    const mockRequest = {
      header: jest.fn().mockReturnValue('Bearer some-token'),
    } as unknown as Express.Request
    const mockResponse = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      header: jest.fn().mockReturnThis(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    JwtService.prototype.verify = jest
      .fn()
      .mockRejectedValue(new TokenExpiredError('Token expired', new Date(0)))

    await verifyToken(mockRequest, mockResponse, mockNext)

    expect(JwtService.prototype.verify).toHaveBeenCalledWith('some-token')
    expect(mockResponse.locals.user).toBeUndefined()
    expect(mockResponse.header).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer error="invalid_token", error_description="The access token expired"',
    )
    expect(mockNext).toHaveBeenCalled()
  })
})
