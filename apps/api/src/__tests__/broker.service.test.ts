import { describe, it, expect, beforeEach } from 'vitest'
import { brokerService } from '../services/broker.service'
import { authService } from '../services/auth.service'

process.env.JWT_SECRET = 'test_secret_key_for_unit_tests_min_32_chars'

let userId: string

const makeBroker = (overrides?: Partial<Parameters<typeof brokerService.create>[0]>) => ({
  name: 'Blackwood Capital',
  slug: 'blackwood-capital',
  description: 'A premier institutional broker.',
  logo_url: 'https://example.com/logo.png',
  website: 'https://blackwood-capital.com',
  broker_type: 'cfd',
  userId,
  ...overrides,
})

beforeEach(async () => {
  const user = await authService.register({
    fullName: 'Broker Owner',
    email: `owner-${Date.now()}@example.com`,
    password: 'SecurePass1',
  })
  userId = user.id
})

describe('brokerService.create', () => {
  it('creates and returns a broker', async () => {
    const broker = await brokerService.create(makeBroker())
    expect(broker.name).toBe('Blackwood Capital')
    expect(broker.slug).toBe('blackwood-capital')
    expect(broker.brokerType).toBe('cfd')
    expect(broker.userId).toBe(userId)
  })

  it('throws 409 on duplicate slug', async () => {
    await brokerService.create(makeBroker())
    await expect(brokerService.create(makeBroker({ name: 'Another' }))).rejects.toMatchObject({
      status: 409,
      message: 'Slug already in use',
    })
  })
})

describe('brokerService.findAll', () => {
  beforeEach(async () => {
    await brokerService.create(makeBroker({ name: 'Alpha CFD', slug: 'alpha-cfd', broker_type: 'cfd' }))
    await brokerService.create(makeBroker({ name: 'Beta Bonds', slug: 'beta-bonds', broker_type: 'bond' }))
    await brokerService.create(makeBroker({ name: 'Gamma Stocks', slug: 'gamma-stocks', broker_type: 'stock' }))
  })

  it('returns all brokers without filters', async () => {
    const result = await brokerService.findAll()
    expect(result.brokers.length).toBe(3)
    expect(result.total).toBe(3)
  })

  it('filters by name (case-insensitive)', async () => {
    const result = await brokerService.findAll('ALPHA')
    expect(result.brokers.length).toBe(1)
    expect(result.brokers[0].name).toBe('Alpha CFD')
  })

  it('filters by broker_type', async () => {
    const result = await brokerService.findAll(undefined, 'bond')
    expect(result.brokers.length).toBe(1)
    expect(result.brokers[0].brokerType).toBe('bond')
  })

  it('combines search and type filter', async () => {
    const result = await brokerService.findAll('beta', 'bond')
    expect(result.brokers.length).toBe(1)
    expect(result.brokers[0].name).toBe('Beta Bonds')
  })

  it('returns empty when no matches', async () => {
    const result = await brokerService.findAll('nonexistent')
    expect(result.brokers.length).toBe(0)
    expect(result.total).toBe(0)
  })

  it('paginates correctly', async () => {
    const page1 = await brokerService.findAll(undefined, undefined, 1, 2)
    expect(page1.brokers.length).toBe(2)
    expect(page1.totalPages).toBe(2)

    const page2 = await brokerService.findAll(undefined, undefined, 2, 2)
    expect(page2.brokers.length).toBe(1)
  })

  it('caps limit at 50', async () => {
    const result = await brokerService.findAll(undefined, undefined, 1, 999)
    expect(result.limit).toBe(50)
  })
})

describe('brokerService.findBySlug', () => {
  beforeEach(async () => {
    await brokerService.create(makeBroker())
  })

  it('returns broker by slug', async () => {
    const broker = await brokerService.findBySlug('blackwood-capital')
    expect(broker.name).toBe('Blackwood Capital')
  })

  it('throws 404 for non-existent slug', async () => {
    await expect(brokerService.findBySlug('does-not-exist')).rejects.toMatchObject({
      status: 404,
      message: 'Broker not found',
    })
  })
})
