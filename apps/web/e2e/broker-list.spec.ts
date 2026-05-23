import { test, expect } from '@playwright/test'

test.describe('Broker List page', () => {
  test('loads the home page with title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Institutional Brokers')
  })

  test('search input is present', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Find brokers by name, region, or asset class...')
    await expect(searchInput).toBeVisible()
  })

  test('filter pills are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'All Partners' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'CFD' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bond' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stock' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Crypto' })).toBeVisible()
  })

  test('filter button updates URL params', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'CFD' }).click()
    await expect(page).toHaveURL(/type=cfd/)
  })

  test('search input updates URL params', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Find brokers by name, region, or asset class...')
    await searchInput.fill('blackwood')
    await page.waitForURL(/search=blackwood/, { timeout: 5000 })
    expect(page.url()).toContain('search=blackwood')
  })

  test('search debounces — URL does not update on every keypress', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Find brokers by name, region, or asset class...')

    let urlChangeCount = 0
    page.on('request', (req) => {
      if (req.url().includes('/api/brokers') && req.url().includes('search=')) {
        urlChangeCount++
      }
    })

    await searchInput.pressSequentially('abc', { delay: 50 })
    await page.waitForTimeout(600)

    expect(urlChangeCount).toBeLessThanOrEqual(1)
  })

  test('clicking broker card navigates to detail page', async ({ page, request }) => {
    const ts = Date.now()
    const loginRes = await request.post('http://localhost:4000/api/login', {
      data: { email: `list-test-${ts}@example.com`, password: 'SecurePass1' },
    }).catch(() => null)

    if (!loginRes || !loginRes.ok()) {
      await request.post('http://localhost:4000/api/register', {
        data: { fullName: 'List Tester', email: `list-test-${ts}@example.com`, password: 'SecurePass1', confirmPassword: 'SecurePass1' },
      })
    }

    const authRes = await request.post('http://localhost:4000/api/login', {
      data: { email: `list-test-${ts}@example.com`, password: 'SecurePass1' },
    })
    const { token } = (await authRes.json()).data

    const slug = `list-broker-${ts}`
    await request.post('http://localhost:4000/api/brokers', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `List Broker ${ts}`,
        slug,
        description: 'Test broker for E2E',
        logo_url: 'https://picsum.photos/200',
        website: 'https://example.com',
        broker_type: 'cfd',
      },
    })

    await page.goto('/')
    await page.waitForSelector('text=View Details', { timeout: 5000 })
    await page.locator('a', { hasText: 'View Details' }).first().click()
    await expect(page).toHaveURL(/\/broker\//)
  })
})
