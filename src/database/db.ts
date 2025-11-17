import Database from 'better-sqlite3';
import path from 'path';
import { config } from 'dotenv';

config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../chess_statistics.db');
const db: Database.Database = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;

