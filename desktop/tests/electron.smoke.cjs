// Integration smoke for our own app. Requires a built app, Vite (dev only), and a backend.
// Set DRIVEGO_SMOKE_PACKAGED=1 after pack:win to exercise file:// and app.isPackaged.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { join } = require('node:path');
const { mkdir } = require('node:fs/promises');
const { _electron: electron } = require('@playwright/test');

test('Electron shell, preload, real backend status and security boundary', { timeout: 60000 }, async () => {
  const packaged = process.env.DRIVEGO_SMOKE_PACKAGED === '1';
  const env = { ...process.env, DRIVEGO_API_BASE_URL: 'http://127.0.0.1:8000' };
  delete env.ELECTRON_RUN_AS_NODE;
  const application = await electron.launch({
    ...(packaged ? { executablePath: join(__dirname, '../release/win-unpacked/DriveGo Admin.exe') } : {}),
    args: packaged ? [] : ['.'],
    cwd: join(__dirname, '..'),
    env,
  });
  try {
    const page = await application.firstWindow();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.getByRole('heading', { name: 'Welcome to DriveGo Admin' }).waitFor();
    await page.getByRole('button', { name: 'Check connection', exact: true }).waitFor();
    const status = await page.evaluate(() => window.drivego.getSystemStatus());
    const expectedBackend = process.env.DRIVEGO_SMOKE_EXPECT_BACKEND || 'connected';
    const expectedDatabase = process.env.DRIVEGO_SMOKE_EXPECT_DATABASE || 'unavailable';
    assert.equal(status.backend, expectedBackend);
    assert.equal(status.database, expectedDatabase);
    assert.equal(await page.locator('.badge.connected').count(),
      [expectedBackend, expectedDatabase].filter(value => value === 'connected').length);
    assert.equal(await page.locator('.badge.unavailable').count(),
      [expectedBackend, expectedDatabase].filter(value => value === 'unavailable').length);
    const isolation = await page.evaluate(() => ({
      requireType: typeof require,
      processType: typeof process,
      bridgeKeys: Object.keys(window.drivego),
      csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]').content,
    }));
    assert.equal(isolation.requireType, 'undefined');
    assert.equal(isolation.processType, 'undefined');
    assert.deepEqual(isolation.bridgeKeys, ['getSystemStatus']);
    if (packaged) {
      assert.match(isolation.csp, /connect-src 'none'/);
      assert.ok(!isolation.csp.includes('unsafe-inline'));
      assert.match(page.url(), /^file:/);
    } else {
      assert.match(page.url(), /^http:\/\/127\.0\.0\.1:5173\//);
    }
    const preferences = await application.evaluate(({ BrowserWindow }) => {
      const window = BrowserWindow.getAllWindows()[0];
      const p = window.webContents.getLastWebPreferences();
      return { contextIsolation: p.contextIsolation, nodeIntegration: p.nodeIntegration, sandbox: p.sandbox };
    });
    assert.deepEqual(preferences, { contextIsolation: true, nodeIntegration: false, sandbox: true });
    for (const section of ['Cars', 'Reservations', 'Clients', 'Contracts', 'Disputes', 'Finance', 'Settings']) {
      await page.getByRole('button', { name: section, exact: false }).click();
      await page.getByRole('heading', { name: 'Not implemented yet' }).waitFor();
    }
    await page.getByRole('button', { name: 'Back to Dashboard' }).click();
    await page.getByRole('button', { name: 'Check connection', exact: true }).waitFor();
    await mkdir(join(__dirname, '../test-results'), { recursive: true });
    await page.screenshot({ path: join(__dirname, `../test-results/${packaged ? 'packaged' : 'development'}.png`) });
    assert.deepEqual(errors, []);
    // Keep the deliberately canceled navigation last: browser automation may retain
    // a pending-navigation marker even though Electron correctly cancels the request.
    const originalUrl = page.url();
    await page.evaluate(() => { window.open('https://example.com'); });
    assert.equal(await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length), 1);
    await page.evaluate(() => { window.location.href = 'https://example.com'; });
    assert.equal(page.url(), originalUrl);
  } finally {
    await application.close();
  }
});
