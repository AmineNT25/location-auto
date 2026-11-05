import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function validateBackendUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Backend URL must be a string');
  const url = new URL(value);
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if (
    (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
    url.username || url.password || url.search || url.hash || url.pathname !== '/'
  ) {
    throw new Error('Backend URL must be an HTTPS origin (HTTP allowed only on loopback)');
  }
  return url.origin;
}

export function readBackendUrl(userDataPath: string): string {
  const environmentUrl = process.env.DRIVEGO_API_BASE_URL;
  if (environmentUrl) return validateBackendUrl(environmentUrl);
  let config: unknown;
  try {
    config = JSON.parse(readFileSync(join(userDataPath, 'config.json'), 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return 'http://127.0.0.1:8000';
    }
    throw new Error('Cannot read desktop config.json');
  }
  if (typeof config !== 'object' || config === null || !('backendUrl' in config)) {
    throw new Error('Desktop config.json must contain backendUrl');
  }
  return validateBackendUrl(config.backendUrl);
}
