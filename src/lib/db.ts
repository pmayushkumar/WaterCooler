import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'water-cooler.db');

function createDatabase(): Database.Database {
  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Run schema
  const schema = fs.readFileSync(
    path.join(process.cwd(), 'src', 'lib', 'schema.sql'),
    'utf-8'
  );
  db.exec(schema);

  return db;
}

// Singleton: survives Next.js hot-reload in dev
const globalForDb = globalThis as unknown as { __db?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__db) {
    globalForDb.__db = createDatabase();
  }
  return globalForDb.__db;
}