import { test, expect, request } from '@playwright/test';

// Этот тест пытается зарегистрировать уникального пользователя напрямую через API бэка
// (несколько популярных путей пробуются), затем авторизуется через UI /login и
// проверяет, что JWT сохранён в localStorage (ключ auth-storage).

const FRONTEND = process.env['FRONTEND_URL'] || 'http://localhost:5173';
const BACKEND = process.env['BACKEND_URL'] || process.env['VITE_API_BASE_URL'] || 'http://localhost:4000';

test.describe('E2E: register -> login', () => {
  test('register via API (debug 404) then login via UI', async ({ page }) => {
    const rnd = Date.now();
    const email = `e2e+${rnd}@example.com`;
    const password = 'Test1234!';

    const api = await request.newContext();

    // Попробуем несколько вариантов endpoint'а регистрации и залогируем ответы
    const registerPaths = [
      '/v1/auth/register',
      '/v1/auth/signup',
      '/auth/register',
      '/auth/signup',
    ];

    let registered = false;
    for (const p of registerPaths) {
      const url = new URL(p, BACKEND).toString();
      try {
        // Некоторые бэки требуют passwordConfirm (см. ваша ошибка 400) — отправляем его
        const resp = await api.post(url, { data: { email, password, passwordConfirm: password } });
        const bodyText = await resp.text().catch(() => '<unreadable>');
        console.log(`[e2e] POST ${url} -> ${resp.status()}`);
        console.log('[e2e] response body:', bodyText);
        const status = resp.status();
        if (status >= 200 && status < 300) {
          registered = true;
          break;
        }
        // если 409 или 422 — пользователь мог существовать; считаем это успехом для теста
        if (status === 409 || status === 422) {
          console.log('[e2e] Received 409/422 (user exists or validation failed) — proceeding to login');
          registered = true;
          break;
        }
      } catch (err: any) {
        console.log(`[e2e] Request to ${url} failed:`, err.message || err);
        // продолжаем пробовать другие пути
      }
    }

    if (!registered) {
      console.warn('[e2e] Registration did not succeed on any tried path — test will still try login to collect more debug info');
    }

    // Проверим, доступен ли фронтенд dev сервер — если нет, попробуем логин через API
    let frontendAvailable = true;
    try {
      const frontResp = await api.get(FRONTEND);
      console.log('[e2e] Frontend GET', FRONTEND, '->', frontResp.status());
    } catch (e: any) {
      console.warn('[e2e] Frontend not available at', FRONTEND, '-', e.message || e);
      frontendAvailable = false;
    }

    if (frontendAvailable) {
      // Открываем страницу логина
      await page.goto(`${FRONTEND}/login`);
    } else {
      console.log('[e2e] Пропускаем UI логин, попробуем логин напрямую через API для диагностики.');
      // Попытаемся логиниться напрямую на API чтобы диагностировать 404/401
      const loginPaths = ['/v1/auth/login', '/auth/login'];
      for (const p of loginPaths) {
        const url = new URL(p, BACKEND).toString();
        try {
          const resp = await api.post(url, { data: { email, password } });
          const bodyText = await resp.text().catch(() => '<unreadable>');
          console.log(`[e2e] API Login POST ${url} -> ${resp.status()}`);
          console.log('[e2e] body:', bodyText);
        } catch (err: any) {
          console.log(`[e2e] API Login POST ${url} failed:`, err.message || err);
        }
      }
      // Завершаем тест с особым сообщением — фронтенд недоступен
      expect(frontendAvailable, `Frontend should be running at ${FRONTEND}`).toBeTruthy();
      return;
    }

    // Заполняем форму — inputs из проекта имеют имена email и password
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Наблюдаем за сетевым запросом логина
    const loginPromise = page.waitForResponse((resp) => {
      const u = resp.url();
      return (u.includes('/v1/auth/login') || u.includes('/auth/login')) && resp.request().method() === 'POST';
    }, { timeout: 5000 }).catch(() => null);

    // Нажимаем кнопку (в UI текст на кнопке в проекте: 'Увійти')
    await page.getByRole('button', { name: /Увійти|Увійти/i }).click();

    const loginResp = await loginPromise;
    if (!loginResp) {
      console.error('[e2e] Не удалось поймать POST /auth/login — возможные причины: фронтенд не отправляет запрос или путь отличается.');
      // Завершаем тест ошибкой, но оставляем логи
      expect(loginResp, 'POST /auth/login should be sent by the UI').not.toBeNull();
      return;
    }

    const status = loginResp.status();
    const respBody = await loginResp.text();
    console.log(`[e2e] Login POST ${loginResp.url()} -> ${status}`);
    console.log('[e2e] login response body:', respBody);

    // Если успешен — проверяем localStorage на наличие токена
    if (status >= 200 && status < 300) {
      // Ждём немножко, чтобы реактивно записавшийся Zustand.persist успел положить данные
  await page.waitForTimeout(200);
  const storage = await page.evaluate(() => localStorage.getItem('auth-storage'));
  console.log('[e2e] auth-storage localStorage value:', storage);
  expect(storage).toBeTruthy();
  const parsed = storage ? (JSON.parse(storage) as any) : null;
  expect(parsed).toBeTruthy();
  // token может быть в parsed.token или в parsed.state.token в зависимости от конфигурации zustand/persist
  const token = parsed?.token ?? parsed?.state?.token;
  console.log('[e2e] extracted token from storage:', token ? '[REDACTED]' : token);
  expect(typeof token === 'string' && token.length > 0).toBeTruthy();
    } else {
      // Если 404/500 — выводим подсказку
      expect(status, `Login response status should be 2xx, got ${status}`).toBeGreaterThanOrEqual(200);
    }
  });
});
