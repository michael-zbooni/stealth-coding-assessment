import Express from 'express'
import { validation } from './validation'
import { IsNotEmpty } from 'class-validator'
import { HttpStatusCode } from '../enums/http-status-code.enum'

class DummyEntity {
  @IsNotEmpty()
  public name!: string
}

describe('validation', () => {
  it('returns a 400 if the validation fails', async () => {
    const mockRequest = {
      body: { name: '' },
    } as unknown as Express.Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    await validation(DummyEntity)(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'New user has invalid data.',
      errors: { name: { isNotEmpty: 'name should not be empty' } },
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next if the validation passes', async () => {
    const mockRequest = {
      body: { name: 'some-name' },
    } as unknown as Express.Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Express.Response
    const mockNext = jest.fn()

    await validation(DummyEntity)(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).not.toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
})
