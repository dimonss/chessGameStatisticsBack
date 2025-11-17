import db from './db';

export function runMigrations() {
  // Create players table
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      rating INTEGER NOT NULL DEFAULT 1500,
      avatar TEXT
    )
  `);

  // Create games table
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      playerId TEXT NOT NULL,
      opponentId TEXT NOT NULL,
      result TEXT NOT NULL CHECK(result IN ('win', 'loss', 'draw')),
      color TEXT NOT NULL CHECK(color IN ('white', 'black')),
      timeControl TEXT NOT NULL CHECK(timeControl IN ('bullet', 'blitz', 'rapid', 'classical')),
      moves INTEGER NOT NULL,
      ratingBefore INTEGER NOT NULL,
      ratingAfter INTEGER NOT NULL,
      ratingChange INTEGER NOT NULL,
      opening TEXT,
      notes TEXT,
      FOREIGN KEY (playerId) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (opponentId) REFERENCES players(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_games_playerId ON games(playerId);
    CREATE INDEX IF NOT EXISTS idx_games_opponentId ON games(opponentId);
    CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
    CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
  `);

  console.log('Database migrations completed successfully');
}

