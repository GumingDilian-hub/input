-- Shared D1 schema for the GLM main Worker and terminal Worker.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits(reset_at);

CREATE TABLE IF NOT EXISTS idempotency (
  idempotency_key TEXT PRIMARY KEY,
  result_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires_at ON idempotency(expires_at);

CREATE TABLE IF NOT EXISTS terminal_tasks (
  task_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  code TEXT NOT NULL,
  input_json TEXT NOT NULL,
  result_json TEXT,
  logs_json TEXT,
  error TEXT,
  duration_ms INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_terminal_tasks_created_at ON terminal_tasks(created_at DESC);