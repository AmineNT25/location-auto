import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopAPI } from '../shared/api.js';

// Sandboxed preloads cannot require local modules. Shared imports are type-only.
const api: DesktopAPI = Object.freeze({
  getSystemStatus: () => ipcRenderer.invoke('drivego:system-status'),
});

contextBridge.exposeInMainWorld('drivego', api);
