import db from '../database/db';
import { Player, PlayerWithStats } from '../types/chess';
import { gameService } from './gameService';

export class PlayerService {
  getAllPlayers(): Player[] {
    const stmt = db.prepare('SELECT * FROM players ORDER BY rating DESC');
    return stmt.all() as Player[];
  }

  getAllPlayersWithStats(): PlayerWithStats[] {
    const players = this.getAllPlayers();
    
    return players.map(player => {
      const games = gameService.getGamesByPlayerId(player.id);
      
      const wins = games.filter(g => g.result === 'win').length;
      const losses = games.filter(g => g.result === 'loss').length;
      const draws = games.filter(g => g.result === 'draw').length;
      const totalGames = games.length;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      
      // Получаем последний рейтинг из последней игры или используем базовый рейтинг
      const latestGame = games[0];
      const currentRating = latestGame?.rating.after || player.rating;
      
      return {
        ...player,
        stats: {
          totalGames,
          wins,
          losses,
          draws,
          winRate,
          currentRating,
          lastGameDate: latestGame?.date
        }
      };
    }).sort((a, b) => {
      const dateA = a.stats.lastGameDate;
      const dateB = b.stats.lastGameDate;

      if (dateA && dateB) {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;
      return 0;
    });
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

