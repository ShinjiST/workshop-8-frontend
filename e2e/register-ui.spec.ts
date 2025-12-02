import { test, expect } from '@playwright/test';

const FRONTEND = process.env['FRONTEND_URL'] || 'http://localhost:5173';
const BACKEND = process.env['BACKEND_URL'] || process.env['VITE_API_BASE_URL'] || 'http://localhost:4000';

test('UI registration -> redirect to login and can login', async ({ page }) => {
  const rnd = Date.now();
  const email = `e2e+ui+${rnd}@example.com`;
  const password = 'Test1234!';

  // Ensure no previous auth state remains (tests may run after login)
  await page.goto(FRONTEND);
  await page.evaluate(() => localStorage.removeItem('auth-storage'));
  // Open register page
  page.on('console', (msg) => console.log('[browser console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('[browser pageerror]', err.message));
  await page.goto(`${FRONTEND}/register`);
  console.log('[e2e] page url after goto:', page.url());
  const bodyHtml = await page.content();
  console.log('[e2e] page content (truncated 2000 chars):', bodyHtml.slice(0, 2000));
    // Save screenshot to inspect what was rendered
    await page.screenshot({ path: 'test-register-page.png', fullPage: true });

  // Wait for the register form to be rendered by the SPA
  await page.waitForSelector('form', { timeout: 10000 });
  await page.waitForSelector('input[name="email"]', { timeout: 10000 });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="passwordConfirm"]', password);

  // Submit registration
  await page.getByRole('button', { name: /Зареєструватися|Зареєструватися/i }).click();

  // After successful registration the page should redirect to /login
  await page.waitForURL('**/login', { timeout: 5000 });

  // Now login via UI
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.getByRole('button', { name: /Увійти|Увійти/i }).click();

  // Wait for network login request
  const resp = await page.waitForResponse((r) => r.url().includes('/v1/auth/login') && r.request().method() === 'POST', { timeout: 5000 });
  expect(resp.status()).toBeGreaterThanOrEqual(200);

  // Check localStorage for token
  const storage = await page.evaluate(() => localStorage.getItem('auth-storage'));
  const parsed = storage ? JSON.parse(storage) : null;
  const token = parsed?.token ?? parsed?.state?.token;
  expect(typeof token === 'string' && token.length > 0).toBeTruthy();
});
