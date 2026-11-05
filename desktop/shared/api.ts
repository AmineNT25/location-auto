export type ConnectionState = 'connected' | 'unavailable';

export interface SystemStatus {
  backend: ConnectionState;
  database: ConnectionState;
  checkedAt: string;
}

export interface DesktopAPI {
  getSystemStatus(): Promise<SystemStatus>;
}
