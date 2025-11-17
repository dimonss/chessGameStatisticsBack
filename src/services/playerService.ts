import db from '../database/db';
import { Player } from '../types/chess';

export class PlayerService {
  getAllPlayers(): Player[] {
    const stmt = db.prepare('SELECT * FROM players ORDER BY rating DESC');
    return stmt.all() as Player[];
  }

  getPlayerById(id: string): Player | null {
    const stmt = db.prepare('SELECT * FROM players WHERE id = ?');
    const player = stmt.get(id) as Player | undefined;
    return player || null;
  }

  getPlayerByUsername(username: string): Player | null {
    const stmt = db.prepare('SELECT * FROM players WHERE username = ?');
    const player = stmt.get(username) as Player | undefined;
    return player || null;
  }

  createPlayer(player: Omit<Player, 'id'>): Player {
    const id = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO players (id, name, username, rating, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, player.name, player.username, player.rating, player.avatar || null);
    return this.getPlayerById(id)!;
  }

  updatePlayer(id: string, updates: Partial<Omit<Player, 'id'>>): Player | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.username !== undefined) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.rating !== undefined) {
      fields.push('rating = ?');
      values.push(updates.rating);
    }
    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }

    if (fields.length === 0) {
      return this.getPlayerById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE players SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getPlayerById(id);
  }

  deletePlayer(id: string): boolean {
    const stmt = db.prepare('DELETE FROM players WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export const playerService = new PlayerService();

