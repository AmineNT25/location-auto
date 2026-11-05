import { app, BrowserWindow, dialog, ipcMain, session } from 'electron';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { config } from 'dotenv';
import { readBackendUrl } from './config.cjs';
import { getSystemStatus } from './health.cjs';

const developmentUrl = 'http://127.0.0.1:5173/';
let mainWindow: BrowserWindow | null = null;

app.setName('DriveGo Admin');

async function openWindow(): Promise<void> {
  // .env is a development convenience only. Installed apps use env or userData/config.json.
  if (!app.isPackaged) config({ path: join(app.getAppPath(), '.env'), quiet: true });
  const backendUrl = readBackendUrl(app.getPath('userData'));
  const rendererFile = join(__dirname, '../../dist/index.html');
  const rendererUrl = app.isPackaged ? pathToFileURL(rendererFile).href : developmentUrl;

  if (app.isPackaged) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({ responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
          "font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; " +
          "form-action 'none'; frame-ancestors 'none'",
        ],
      } });
    });
  }

  const window = new BrowserWindow({
    title: 'DriveGo Admin', width: 1240, height: 820, minWidth: 880, minHeight: 600,
    backgroundColor: '#f5f6fa', show: false, autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
      devTools: !app.isPackaged,
    },
  });
  mainWindow = window;
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.webContents.on('will-redirect', (event) => event.preventDefault());
  window.webContents.on('will-attach-webview', (event) => event.preventDefault());
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);

  // One fixed channel, no URL/path/SQL arguments, exact main-frame sender validation.
  ipcMain.removeHandler('drivego:system-status');
  let pending: ReturnType<typeof getSystemStatus> | undefined;
  ipcMain.handle('drivego:system-status', (event, ...args: unknown[]) => {
    if (args.length !== 0 || event.sender !== window.webContents ||
        event.senderFrame !== window.webContents.mainFrame || event.senderFrame.url !== rendererUrl) {
      throw new Error('Invalid status request');
    }
    // Coalesce simultaneous requests so a renderer cannot create unbounded probes.
    pending ??= getSystemStatus(backendUrl).finally(() => { pending = undefined; });
    return pending;
  });
  window.once('ready-to-show', () => window.show());
  window.on('closed', () => {
    mainWindow = null;
    ipcMain.removeHandler('drivego:system-status');
  });
  if (app.isPackaged) await window.loadFile(rendererFile);
  else await window.loadURL(developmentUrl);
}

app.whenReady().then(openWindow).catch(() => {
  dialog.showErrorBox('DriveGo Admin could not start',
    'Check the backend URL configuration and renderer build. No connection details are displayed.');
  app.quit();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => {
  if (!mainWindow) void openWindow().catch(() => app.quit());
});
