import { getDb } from './db';

export function getConfigValue(key: string, defaultValue: string): string {
  const db = getDb();
  const row = db.prepare('SELECT config_value FROM app_config WHERE config_key = ?').get(key) as
    | { config_value: string }
    | undefined;
  return row?.config_value ?? defaultValue;
}

export function getMaxConnections(): number {
  const val = getConfigValue('max_connections_per_user', '10');
  const parsed = parseInt(val, 10);
  return isNaN(parsed) || parsed < 0 ? 10 : parsed;
}