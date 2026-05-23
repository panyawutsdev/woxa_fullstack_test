import { describe, it, expect, vi } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.middleware'

const schema = z.object({
  name: z.string().min(1),
  age: z.number().min(0),
})

const mockRes = () => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('validate middleware', () => {
  it('calls next() on valid data and replaces req.body with parsed data', () => {
    const req = { body: { name: 'Alice', age: 25 } } as Request
    const res = mockRes()
    const next = vi.fn() as NextFunction

    validate(schema)(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.body).toEqual({ name: 'Alice', age: 25 })
  })

  it('returns 400 with details on invalid data', () => {
    const req = { body: { name: '', age: -1 } } as Request
    const res = mockRes()
    const next = vi.fn() as NextFunction

    validate(schema)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({ field: expect.any(String), message: expect.any(String) }),
        ]),
      })
    )
  })

  it('returns 400 on missing required fields', () => {
    const req = { body: {} } as Request
    const res = mockRes()
    const next = vi.fn() as NextFunction

    validate(schema)(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })
})
