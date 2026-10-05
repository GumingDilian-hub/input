PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schools (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,created_by INTEGER,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL UNIQUE,password TEXT NOT NULL,token TEXT UNIQUE,school TEXT,school_id INTEGER,role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('coach','student')),avatar TEXT,honor_year TEXT,honor_rank TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS papers (id INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT NOT NULL UNIQUE,title TEXT NOT NULL,source_url TEXT,document_type TEXT NOT NULL DEFAULT 'pdf',created_by INTEGER,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT,public_id TEXT NOT NULL UNIQUE,paper_id INTEGER,number INTEGER NOT NULL,stem TEXT NOT NULL DEFAULT '',ocr_text TEXT,solution TEXT,difficulty REAL,question_type TEXT,source TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(paper_id) REFERENCES papers(id));
CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY AUTOINCREMENT,paper_id INTEGER NOT NULL,school_id INTEGER,title TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'school' CHECK(kind IN ('school','inter_school')),starts_at TEXT,deadline TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','live','closed')),created_by INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(paper_id) REFERENCES papers(id),FOREIGN KEY(school_id) REFERENCES schools(id));
CREATE TABLE IF NOT EXISTS exam_schools (exam_id INTEGER NOT NULL,school_id INTEGER NOT NULL,PRIMARY KEY(exam_id,school_id),FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,FOREIGN KEY(school_id) REFERENCES schools(id));
CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT,exam_id INTEGER NOT NULL,student_id INTEGER NOT NULL,started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,submitted_at TEXT,local_revision INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','submitted','locked')),UNIQUE(exam_id,student_id),FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,FOREIGN KEY(student_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS answers (submission_id INTEGER NOT NULL,question_id INTEGER NOT NULL,answer_json TEXT NOT NULL DEFAULT '[]',updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(submission_id,question_id),FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE,FOREIGN KEY(question_id) REFERENCES questions(id));
CREATE TABLE IF NOT EXISTS answer_key_versions (id INTEGER PRIMARY KEY AUTOINCREMENT,exam_id INTEGER NOT NULL,version INTEGER NOT NULL,note TEXT,created_by INTEGER NOT NULL,is_current INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(exam_id,version));
CREATE TABLE IF NOT EXISTS answer_keys (version_id INTEGER NOT NULL,question_id INTEGER NOT NULL,answer_json TEXT NOT NULL,points REAL NOT NULL DEFAULT 0,PRIMARY KEY(version_id,question_id));
CREATE TABLE IF NOT EXISTS score_versions (id INTEGER PRIMARY KEY AUTOINCREMENT,exam_id INTEGER NOT NULL,version INTEGER NOT NULL,answer_key_version_id INTEGER,scoring_rule_json TEXT NOT NULL,created_by INTEGER NOT NULL,is_current INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(exam_id,version));
CREATE TABLE IF NOT EXISTS scores (score_version_id INTEGER NOT NULL,submission_id INTEGER NOT NULL,total REAL NOT NULL DEFAULT 0,detail_json TEXT NOT NULL DEFAULT '[]',calculated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(score_version_id,submission_id));
CREATE TABLE IF NOT EXISTS question_comments (id INTEGER PRIMARY KEY AUTOINCREMENT,question_id INTEGER NOT NULL,user_id INTEGER NOT NULL,content TEXT NOT NULL,hidden INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_exams_school ON exams(school_id);
CREATE INDEX IF NOT EXISTS idx_exam_schools_school ON exam_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exam ON submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_comments_question ON question_comments(question_id);
CREATE TABLE IF NOT EXISTS historical_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL,
  student_id INTEGER,
  student_name TEXT NOT NULL,
  source_name TEXT,
  exam_date TEXT,
  mode TEXT NOT NULL,
  raw_answer_json TEXT NOT NULL DEFAULT '{}',
  normalized_answer_json TEXT NOT NULL DEFAULT '{}',
  score REAL NOT NULL DEFAULT 0,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(school_id) REFERENCES schools(id),
  FOREIGN KEY(student_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_historical_school_student ON historical_scores(school_id,student_id);
CREATE INDEX IF NOT EXISTS idx_historical_student_date ON historical_scores(student_id,exam_date);

CREATE TABLE IF NOT EXISTS student_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL UNIQUE,
  profile_json TEXT NOT NULL DEFAULT '{}',
  model_id TEXT NOT NULL,
  generated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS ai_generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  kind TEXT NOT NULL,
  model_id TEXT NOT NULL,
  prompt_json TEXT NOT NULL DEFAULT '{}',
  result_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS error_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  source_submission_id INTEGER,
  status TEXT NOT NULL DEFAULT 'open',
  last_answer TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_score REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id,question_id),
  FOREIGN KEY(student_id) REFERENCES users(id),
  FOREIGN KEY(question_id) REFERENCES questions(id)
);
CREATE INDEX IF NOT EXISTS idx_error_questions_student ON error_questions(student_id,status);
CREATE INDEX IF NOT EXISTS idx_ai_generations_student ON ai_generations(student_id,created_at);
