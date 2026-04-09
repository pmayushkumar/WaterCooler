CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  grew_up_places TEXT,
  current_city TEXT,
  current_country TEXT,
  secret_token TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS colleagues (
  colleague_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grew_up_places TEXT,
  current_city TEXT,
  current_country TEXT,
  family_info TEXT,
  hobbies TEXT,
  preference_type TEXT CHECK(preference_type IN ('outdoor', 'culture', 'sports')),
  sports_detail TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS app_config (
  config_key TEXT PRIMARY KEY,
  config_value TEXT
);

INSERT OR IGNORE INTO app_config (config_key, config_value) VALUES ('max_connections_per_user', '10');

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  rating TEXT,
  suggestions TEXT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS limit_increase_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  current_limit INTEGER,
  how_many_more INTEGER,
  reason TEXT,
  other_reason TEXT,
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending'
);
