-- Persist Agent runs and ordered events for the live workflow dashboard.
CREATE TABLE IF NOT EXISTS workflow_runs (
  run_id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  repo TEXT NOT NULL,
  branch TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER,
  final_text TEXT,
  error TEXT,
  rounds INTEGER,
  usage_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_started_at ON workflow_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_repo ON workflow_runs(owner, repo, started_at DESC);

CREATE TABLE IF NOT EXISTS workflow_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (run_id) REFERENCES workflow_runs(run_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_workflow_events_run_id_event_id ON workflow_events(run_id, event_id);