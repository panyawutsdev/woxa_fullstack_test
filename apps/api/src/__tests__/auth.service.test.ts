import { describe, it, expect, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { authService } from '../services/auth.service'
import { prisma } from '../lib/prisma'

process.env.JWT_SECRET = 'test_secret_key_for_unit_tests_min_32_chars'

describe('authService.register', () => {
  it('creates a user and returns without password', async () => {
    const result = await authService.register({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass1',
    })
    expect(result.email).toBe('test@example.com')
    expect(result.fullName).toBe('Test User')
    expect(result).not.toHaveProperty('password')
  })

  it('hashes the password before storing', async () => {
    await authService.register({
      fullName: 'Hash Test',
      email: 'hash@example.com',
      password: 'SecurePass1',
    })
    const user = await prisma.user.findUnique({ where: { email: 'hash@example.com' } })
    expect(user?.password).not.toBe('SecurePass1')
    const valid = await bcrypt.compare('SecurePass1', user!.password)
    expect(valid).toBe(true)
  })

  it('throws 409 if email already exists', async () => {
    await authService.register({
      fullName: 'First',
      email: 'dup@example.com',
      password: 'SecurePass1',
    })
    await expect(
      authService.register({ fullName: 'Second', email: 'dup@example.com', password: 'SecurePass1' })
    ).rejects.toMatchObject({ status: 409, message: 'Email already in use' })
  })
})

describe('authService.login', () => {
  beforeEach(async () => {
    await authService.register({
      fullName: 'Login User',
      email: 'login@example.com',
      password: 'SecurePass1',
    })
  })

  it('returns token and user on valid credentials', async () => {
    const result = await authService.login('login@example.com', 'SecurePass1')
    expect(result).toHaveProperty('token')
    expect(result.user.email).toBe('login@example.com')
    expect(result.user).not.toHaveProperty('password')
    expect(typeof result.token).toBe('string')
    expect(result.token.split('.')).toHaveLength(3)
  })

  it('throws 401 on wrong password', async () => {
    await expect(
      authService.login('login@example.com', 'WrongPassword1')
    ).rejects.toMatchObject({ status: 401, message: 'Invalid credentials' })
  })

  it('throws 401 on non-existent email (same error — prevents enumeration)', async () => {
    await expect(
      authService.login('nobody@example.com', 'SecurePass1')
    ).rejects.toMatchObject({ status: 401, message: 'Invalid credentials' })
  })

  it('throws 401 for soft-deleted user', async () => {
    await prisma.user.update({
      where: { email: 'login@example.com' },
      data: { deletedAt: new Date() },
    })
    await expect(
      authService.login('login@example.com', 'SecurePass1')
    ).rejects.toMatchObject({ status: 401 })
  })
})
