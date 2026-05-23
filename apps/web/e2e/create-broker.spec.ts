import { test, expect } from '@playwright/test'

const ts = Date.now()
const testUser = {
  email: `create-test-${ts}@example.com`,
  password: 'SecurePass1',
}

test.describe('Create Broker page', () => {
  test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:4000/api/register', {
      data: {
        fullName: 'Create Tester',
        email: testUser.email,
        password: testUser.password,
        confirmPassword: testUser.password,
      },
    })
  })

  const loginAndGo = async (page: any) => {
    await page.goto('/login')
    await page.getByPlaceholder('user@institution.com').fill(testUser.email)
    await page.locator('input[type="password"]').fill(testUser.password)
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page).toHaveURL('/create', { timeout: 10000 })
  }

  test('auth guard: unauthenticated redirects to /login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/create')
    await expect(page).toHaveURL('/login')
  })

  test('page title is "Submit Broker"', async ({ page }) => {
    await loginAndGo(page)
    await expect(page.locator('h1')).toContainText('Submit Broker')
  })

  test('broker_type is a <select> dropdown, not buttons', async ({ page }) => {
    await loginAndGo(page)
    await expect(page.locator('[role="combobox"]')).toBeVisible()
    await expect(page.locator('button[data-type]')).not.toBeVisible()
  })

  test('slug auto-fills from name', async ({ page }) => {
    await loginAndGo(page)
    await page.getByPlaceholder('e.g. Blackwood Capital Markets').fill('My New Broker')
    const slugInput = page.getByPlaceholder('blackwood-capital-markets')
    await expect(slugInput).toHaveValue('my-new-broker', { timeout: 2000 })
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await loginAndGo(page)
    await page.getByRole('button', { name: /Submit Application/i }).click()
    await expect(page.locator('text=Name is required')).toBeVisible()
  })

  test('submits form and redirects to / (broker list)', async ({ page }) => {
    await loginAndGo(page)
    const slug = `e2e-broker-${ts}`

    await page.getByPlaceholder('e.g. Blackwood Capital Markets').fill(`E2E Broker ${ts}`)
    await page.getByPlaceholder('blackwood-capital-markets').clear()
    await page.getByPlaceholder('blackwood-capital-markets').fill(slug)

    await page.locator('[role="combobox"]').click()
    await page.getByRole('option', { name: 'CFD' }).click()

    await page.getByPlaceholder('https://example.com/logo.png').fill('https://picsum.photos/200')
    await page.getByPlaceholder('https://broker-site.com').fill('https://example-broker.com')
    await page.locator('textarea').fill('This is a comprehensive institutional broker description for E2E testing.')

    await page.getByRole('button', { name: /Submit Application/i }).click()

    await expect(page).toHaveURL('/', { timeout: 10000 })
  })
})

test.describe('Broker Detail page SEO', () => {
  test('page title includes broker name', async ({ page, request }) => {
    const authRes = await request.post('http://localhost:4000/api/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    const { token } = (await authRes.json()).data

    const slug = `seo-test-${ts}`
    await request.post('http://localhost:4000/api/brokers', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `SEO Test Broker ${ts}`,
        slug,
        description: 'SEO test broker with a description longer than 50 characters for meta tag.',
        logo_url: 'https://picsum.photos/200',
        website: 'https://seo-broker.com',
        broker_type: 'stock',
      },
    })

    await page.goto(`/broker/${slug}`)
    await expect(page).toHaveTitle(`SEO Test Broker ${ts} | Woxa Institutional Brokers`)
  })

  test('broker detail page shows broker name in h1', async ({ page, request }) => {
    const authRes = await request.post('http://localhost:4000/api/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    const { token } = (await authRes.json()).data

    const slug = `h1-test-${ts}`
    await request.post('http://localhost:4000/api/brokers', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `H1 Test Broker ${ts}`,
        slug,
        description: 'Broker description for h1 heading test in E2E.',
        logo_url: 'https://picsum.photos/200',
        website: 'https://h1-broker.com',
        broker_type: 'crypto',
      },
    })

    await page.goto(`/broker/${slug}`)
    await expect(page.locator('h1')).toContainText(`H1 Test Broker ${ts}`)
  })
})
