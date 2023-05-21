import { HttpStatusCode } from '../enums/http-status-code.enum'
import { isOwnAccount } from './is-own-account'
import Express from 'express'

describe('isOwnAccount', () => {
  it('returns a 401 if the user is not logged in', () => {
    const mockRequest = {
      params: { id: 1 },
    } as unknown as Express.Request
    const mockResponse = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    isOwnAccount(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized: OAuth2 bearer token missing, invalid, or expired.',
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 403 if the user is not accessing their own account', () => {
    const mockRequest = {
      params: { id: 1 },
    } as unknown as Express.Request
    const mockResponse = {
      locals: { user: { id: 2 } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    isOwnAccount(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.Forbidden)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: `This is not User#2's account`,
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next if the user is accessing their own account', () => {
    const mockRequest = {
      params: { id: 1 },
    } as unknown as Express.Request
    const mockResponse = {
      locals: { user: { id: 1 } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    isOwnAccount(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
})
