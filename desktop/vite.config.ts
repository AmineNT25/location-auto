import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'packaged-content-security-policy',
    apply: 'build',
    transformIndexHtml: (html) => html
      .replaceAll(" 'unsafe-inline'", '')
      .replace("connect-src 'self' ws://127.0.0.1:5173", "connect-src 'none'"),
  }],
  // React refresh needs an inline preamble in development; packaged assets do not.
  // The packaged policy lives in the HTML itself, including for file:// resources.
  // No renderer-to-backend network access is needed: health goes through typed IPC.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});
