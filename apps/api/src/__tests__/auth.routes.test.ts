import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../app'

process.env.JWT_SECRET = 'test_secret_key_for_integration_tests_32_chars'

const validUser = {
  fullName: 'Integration User',
  email: 'integration@example.com',
  password: 'SecurePass1',
  confirmPassword: 'SecurePass1',
}

describe('POST /api/register', () => {
  it('returns 201 with success message on valid data', async () => {
    const res = await request(app).post('/api/register').send(validUser)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.message).toBe('Account created. Please log in.')
  })

  it('returns 409 when email already exists', async () => {
    await request(app).post('/api/register').send(validUser)
    const res = await request(app).post('/api/register').send(validUser)
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('returns 400 on invalid email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ ...validUser, email: 'not-an-email' })
    expect(res.status).toBe(400)
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    )
  })

  it('returns 400 when passwords do not match', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ ...validUser, email: 'mismatch@example.com', confirmPassword: 'DifferentPass1' })
    expect(res.status).toBe(400)
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'confirmPassword' })])
    )
  })

  it('returns 400 when password lacks uppercase', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ ...validUser, email: 'weak@example.com', password: 'lowercase1', confirmPassword: 'lowercase1' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/register').send(validUser)
  })

  it('returns 200 with token and user on valid credentials', async () => {
    const res = await request(app).post('/api/login').send({
      email: validUser.email,
      password: validUser.password,
    })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
    expect(res.body.data.user.email).toBe(validUser.email)
    expect(res.body.data.user).not.toHaveProperty('password')
  })

  it('returns 401 on wrong password (same error — no enumeration)', async () => {
    const res = await request(app).post('/api/login').send({
      email: validUser.email,
      password: 'WrongPassword1',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid credentials')
  })

  it('returns 401 on non-existent email (same error — no enumeration)', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nobody@example.com',
      password: 'SecurePass1',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid credentials')
  })

  it('returns 400 on missing fields', async () => {
    const res = await request(app).post('/api/login').send({})
    expect(res.status).toBe(400)
  })
})
