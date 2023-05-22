import Express from 'express'
import { validatePaginationParams } from './validate-pagination-params'
import { HttpStatusCode } from '../enums/http-status-code.enum'

describe('validatePaginationParams', () => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Express.Response

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns a 400 if the limit is not a number', () => {
    const mockRequest = {
      query: { limit: 'not-a-number' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid limit' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 400 if the limit is less than 1', () => {
    const mockRequest = {
      query: { limit: '0' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Limit cannot be zero or negative' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 400 if the limit is greater than 100', () => {
    const mockRequest = {
      query: { limit: '101' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Limit is too high' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 400 if the offset is not a number', () => {
    const mockRequest = {
      query: { offset: 'not-a-number' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid offset' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('returns a 400 if the offset is less than 0', () => {
    const mockRequest = {
      query: { offset: '-1' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Offset cannot be negative' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next if the limit and offset are valid', () => {
    const mockRequest = {
      query: { limit: '1', offset: '0' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })

  it('calls next if the limit is missing', () => {
    const mockRequest = {
      query: { offset: '0' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })

  it('calls next if the offset is missing', () => {
    const mockRequest = {
      query: { limit: '1' },
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })

  it('calls next if the limit and offset are both missing', () => {
    const mockRequest = {
      query: {},
    } as unknown as Express.Request
    const mockNext = jest.fn()

    validatePaginationParams(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
})
