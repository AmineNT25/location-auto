const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { getSystemStatus } = require('../dist-electron/electron/health.cjs');
const { validateBackendUrl } = require('../dist-electron/electron/config.cjs');

test('backend origin rejects credentials, unsafe protocols, paths and redirects', () => {
  assert.equal(validateBackendUrl('http://127.0.0.1:8000/'), 'http://127.0.0.1:8000');
  assert.equal(validateBackendUrl('https://api.example.com'), 'https://api.example.com');
  for (const url of ['http://api.example.com', 'file:///tmp/api', 'https://user:secret@api.example.com',
    'https://api.example.com/path', 'https://api.example.com?token=secret', 'https://api.example.com/#hash']) {
    assert.throws(() => validateBackendUrl(url));
  }
});

test('status distinguishes liveness from readiness and rejects malformed responses', async () => {
  let mode = 'ready';
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'malformed') return res.end('{}');
    if (mode === 'redirect') { res.writeHead(302, { Location: '/other' }); return res.end(); }
    if (req.url === '/api/v1/health') return res.end('{"status":"ok"}');
    res.statusCode = mode === 'ready' ? 200 : 503;
    res.end(JSON.stringify(mode === 'ready'
      ? { status: 'ready', database: 'connected' }
      : { status: 'unavailable', database: 'unavailable' }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await getSystemStatus(base)).database, 'connected');
    mode = 'unavailable';
    const partial = await getSystemStatus(base);
    assert.equal(partial.backend, 'connected');
    assert.equal(partial.database, 'unavailable');
    for (mode of ['malformed', 'redirect']) {
      const result = await getSystemStatus(base);
      assert.equal(result.backend, 'unavailable');
      assert.equal(result.database, 'unavailable');
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
  const result = await getSystemStatus(base);
  assert.equal(result.backend, 'unavailable');
  assert.equal(result.database, 'unavailable');
});
