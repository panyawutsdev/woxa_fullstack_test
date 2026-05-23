import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../app'

process.env.JWT_SECRET = 'test_secret_key_for_integration_tests_32_chars'

let token: string

const validBroker = {
  name: 'Blackwood Capital Markets',
  slug: 'blackwood-capital-markets',
  description: 'The definitive platform for sovereign wealth management.',
  logo_url: 'https://example.com/logo.png',
  website: 'https://blackwood-capital.com',
  broker_type: 'cfd',
}

beforeEach(async () => {
  const email = `tester-${Date.now()}@example.com`
  await request(app).post('/api/register').send({
    fullName: 'Broker Tester',
    email,
    password: 'SecurePass1',
    confirmPassword: 'SecurePass1',
  })
  const loginRes = await request(app).post('/api/login').send({
    email,
    password: 'SecurePass1',
  })
  token = loginRes.body.data?.token
})

describe('POST /api/brokers', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/brokers').send(validBroker)
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', 'Bearer invalidtoken')
      .send(validBroker)
    expect(res.status).toBe(401)
  })

  it('creates a broker with valid JWT', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send(validBroker)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.slug).toBe('blackwood-capital-markets')
  })

  it('returns 409 on duplicate slug', async () => {
    await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send(validBroker)
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, name: 'Different Name' })
    expect(res.status).toBe(409)
  })

  it('returns 400 when logo_url is not a valid URL', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, slug: 'other-slug', logo_url: 'not-a-url' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when logo_url does not use HTTPS', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, slug: 'other-slug-2', logo_url: 'http://example.com/logo.png' })
    expect(res.status).toBe(400)
  })

  it('returns 400 on invalid broker_type', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, slug: 'type-test', broker_type: 'invalid' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when slug has uppercase letters', async () => {
    const res = await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, slug: 'Invalid-Slug' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/brokers', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send(validBroker)
    await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validBroker, name: 'Sterling Bonds', slug: 'sterling-bonds', broker_type: 'bond' })
  })

  it('returns broker list with pagination info', async () => {
    const res = await request(app).get('/api/brokers')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data.brokers)).toBe(true)
    expect(res.body.data).toHaveProperty('total')
    expect(res.body.data).toHaveProperty('totalPages')
  })

  it('filters by name (search)', async () => {
    const res = await request(app).get('/api/brokers?search=black')
    expect(res.status).toBe(200)
    expect(res.body.data.brokers.length).toBe(1)
    expect(res.body.data.brokers[0].name).toBe('Blackwood Capital Markets')
  })

  it('search is case-insensitive', async () => {
    const res = await request(app).get('/api/brokers?search=BLACK')
    expect(res.body.data.brokers.length).toBe(1)
  })

  it('filters by type', async () => {
    const res = await request(app).get('/api/brokers?type=bond')
    expect(res.status).toBe(200)
    expect(res.body.data.brokers.every((b: any) => b.brokerType === 'bond')).toBe(true)
  })

  it('combines search and type filter', async () => {
    const res = await request(app).get('/api/brokers?search=black&type=cfd')
    expect(res.body.data.brokers.length).toBe(1)
    expect(res.body.data.brokers[0].brokerType).toBe('cfd')
  })

  it('returns empty array when nothing matches', async () => {
    const res = await request(app).get('/api/brokers?search=nonexistent')
    expect(res.body.data.brokers.length).toBe(0)
    expect(res.body.data.total).toBe(0)
  })
})

describe('GET /api/brokers/:slug', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/brokers')
      .set('Authorization', `Bearer ${token}`)
      .send(validBroker)
  })

  it('returns broker by slug', async () => {
    const res = await request(app).get('/api/brokers/blackwood-capital-markets')
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Blackwood Capital Markets')
  })

  it('returns 404 for non-existent slug', async () => {
    const res = await request(app).get('/api/brokers/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })
})
