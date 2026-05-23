import { test, expect } from '@playwright/test'

const timestamp = Date.now()
const testUser = {
  fullName: 'E2E Test User',
  email: `e2e-${timestamp}@example.com`,
  password: 'SecurePass1',
}

test.describe('Registration flow', () => {
  test('navigates to /login after successful registration', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('h2')).toContainText('Institutional Onboarding')

    await page.getByPlaceholder('Alexander Sterling').fill(testUser.fullName)
    await page.getByPlaceholder('user@institution.com').fill(testUser.email)
    const passwordInputs = page.locator('input[type="password"]')
    await passwordInputs.nth(0).fill(testUser.password)
    await passwordInputs.nth(1).fill(testUser.password)
    await page.locator('input[type="checkbox"]').check()

    await page.getByRole('button', { name: /Initialize Registration/i }).click()

    await expect(page).toHaveURL('/login', { timeout: 10000 })
  })

  test('shows validation error for weak password', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Alexander Sterling').fill('Test User')
    await page.getByPlaceholder('user@institution.com').fill('test@example.com')
    const passwordInputs = page.locator('input[type="password"]')
    await passwordInputs.nth(0).fill('weak')
    await passwordInputs.nth(1).fill('weak')
    await page.locator('input[type="checkbox"]').check()
    await page.getByRole('button', { name: /Initialize Registration/i }).click()

    await expect(page.locator('text=Minimum 8 characters')).toBeVisible()
  })
})

test.describe('Login flow', () => {
  test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:4000/api/register', {
      data: {
        fullName: testUser.fullName,
        email: testUser.email,
        password: testUser.password,
        confirmPassword: testUser.password,
      },
    })
  })

  test('redirects to /create (not home) after successful login', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Sterling Midnight')

    await page.getByPlaceholder('user@institution.com').fill(testUser.email)
    await page.locator('input[type="password"]').fill(testUser.password)
    await page.getByRole('button', { name: /login/i }).click()

    await expect(page).toHaveURL('/create', { timeout: 10000 })
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('user@institution.com').fill(testUser.email)
    await page.locator('input[type="password"]').fill('WrongPassword1')
    await page.getByRole('button', { name: /login/i }).click()

    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Auth guard', () => {
  test('unauthenticated GET /create redirects to /login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/create')
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })
})
