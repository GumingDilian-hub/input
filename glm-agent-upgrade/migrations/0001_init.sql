-- Schema matching the standalone main Worker and the 11 SQL statements
-- previously provided for manual D1 Console execution.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON rate_limits(updated_at);

CREATE TABLE IF NOT EXISTS idempotency (
  key TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  response TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_idempotency_created_at ON idempotency(created_at);

CREATE TABLE IF NOT EXISTS terminal_tasks (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  code TEXT,
  input TEXT,
  result TEXT,
  logs TEXT,
  error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_terminal_tasks_created_at ON terminal_tasks(created_at);
