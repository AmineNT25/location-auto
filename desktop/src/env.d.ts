import type { DesktopAPI } from '../shared/api';

declare global {
  interface Window { drivego?: DesktopAPI }
}
