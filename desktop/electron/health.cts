import type { SystemStatus } from '../shared/api.js';

async function probe(baseUrl: string, path: string, expected: 'ok' | 'ready'): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return typeof body === 'object' && body !== null && 'status' in body &&
      body.status === expected &&
      (expected !== 'ready' || ('database' in body && body.database === 'connected'));
  } catch {
    return false;
  }
}

export async function getSystemStatus(baseUrl: string): Promise<SystemStatus> {
  const [alive, ready] = await Promise.all([
    probe(baseUrl, '/api/v1/health', 'ok'),
    probe(baseUrl, '/api/v1/health/ready', 'ready'),
  ]);
  return {
    backend: alive ? 'connected' : 'unavailable',
    database: ready ? 'connected' : 'unavailable',
    checkedAt: new Date().toISOString(),
  };
}
