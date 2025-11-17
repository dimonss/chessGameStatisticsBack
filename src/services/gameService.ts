import db from '../database/db';
import { ChessGame, GameStatistics, TimeControl } from '../types/chess';

export class GameService {
  getAllGames(playerId?: string): ChessGame[] {
    let query = `
      SELECT 
        id, date, playerId, opponentId, result, color, timeControl, moves,
        ratingBefore as 'rating.before',
        ratingAfter as 'rating.after',
        ratingChange as 'rating.change',
        opening, notes
      FROM games
    `;
    
    const params: any[] = [];
    if (playerId) {
      query += ' WHERE playerId = ?';
      params.push(playerId);
    }
    
    query += ' ORDER BY date DESC';
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      playerId: row.playerId,
      opponentId: row.opponentId,
      result: row.result,
      color: row.color,
      timeControl: row.timeControl,
      moves: row.moves,
      rating: {
        before: row['rating.before'],
        after: row['rating.after'],
        change: row['rating.change']
      },
      opening: row.opening || undefined,
      notes: row.notes || undefined
    }));
  }

  getGameById(id: string): ChessGame | null {
    const stmt = db.prepare(`
      SELECT 
        id, date, playerId, opponentId, result, color, timeControl, moves,
        ratingBefore as 'rating.before',
        ratingAfter as 'rating.after',
        ratingChange as 'rating.change',
        opening, notes
      FROM games
      WHERE id = ?
    `);
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      date: row.date,
      playerId: row.playerId,
      opponentId: row.opponentId,
      result: row.result,
      color: row.color,
      timeControl: row.timeControl,
      moves: row.moves,
      rating: {
        before: row['rating.before'],
        after: row['rating.after'],
        change: row['rating.change']
      },
      opening: row.opening || undefined,
      notes: row.notes || undefined
    };
  }

  getGamesByPlayerId(playerId: string): ChessGame[] {
    return this.getAllGames(playerId);
  }

  createGame(game: Omit<ChessGame, 'id'>): ChessGame {
    const id = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO games (
        id, date, playerId, opponentId, result, color, timeControl, moves,
        ratingBefore, ratingAfter, ratingChange, opening, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      game.date,
      game.playerId,
      game.opponentId,
      game.result,
      game.color,
      game.timeControl,
      game.moves,
      game.rating.before,
      game.rating.after,
      game.rating.change,
      game.opening || null,
      game.notes || null
    );
    
    return this.getGameById(id)!;
  }

  updateGame(id: string, updates: Partial<Omit<ChessGame, 'id'>>): ChessGame | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.date !== undefined) {
      fields.push('date = ?');
      values.push(updates.date);
    }
    if (updates.playerId !== undefined) {
      fields.push('playerId = ?');
      values.push(updates.playerId);
    }
    if (updates.opponentId !== undefined) {
      fields.push('opponentId = ?');
      values.push(updates.opponentId);
    }
    if (updates.result !== undefined) {
      fields.push('result = ?');
      values.push(updates.result);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }
    if (updates.timeControl !== undefined) {
      fields.push('timeControl = ?');
      values.push(updates.timeControl);
    }
    if (updates.moves !== undefined) {
      fields.push('moves = ?');
      values.push(updates.moves);
    }
    if (updates.rating !== undefined) {
      fields.push('ratingBefore = ?');
      values.push(updates.rating.before);
      fields.push('ratingAfter = ?');
      values.push(updates.rating.after);
      fields.push('ratingChange = ?');
      values.push(updates.rating.change);
    }
    if (updates.opening !== undefined) {
      fields.push('opening = ?');
      values.push(updates.opening);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }

    if (fields.length === 0) {
      return this.getGameById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE games SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return this.getGameById(id);
  }

  deleteGame(id: string): boolean {
    const stmt = db.prepare('DELETE FROM games WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  getPlayerStatistics(playerId: string): GameStatistics {
    const games = this.getGamesByPlayerId(playerId);
    
    if (games.length === 0) {
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageRating: 0,
        ratingChange: 0,
        gamesByTimeControl: {
          bullet: 0,
          blitz: 0,
          rapid: 0,
          classical: 0
        },
        gamesByColor: {
          white: 0,
          black: 0
        },
        recentGames: []
      };
    }

    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const draws = games.filter(g => g.result === 'draw').length;
    const winRate = (wins / games.length) * 100;

    const latestRating = games[0]?.rating.after || 0;
    const oldestRating = games[games.length - 1]?.rating.before || 0;
    const ratingChange = latestRating - oldestRating;

    const averageRating = games.reduce((sum, g) => sum + g.rating.after, 0) / games.length;

    const gamesByTimeControl: Record<TimeControl, number> = {
      bullet: 0,
      blitz: 0,
      rapid: 0,
      classical: 0
    };

    games.forEach(game => {
      gamesByTimeControl[game.timeControl]++;
    });

    const gamesByColor = {
      white: games.filter(g => g.color === 'white').length,
      black: games.filter(g => g.color === 'black').length
    };

    return {
      totalGames: games.length,
      wins,
      losses,
      draws,
      winRate,
      averageRating: Math.round(averageRating),
      ratingChange,
      gamesByTimeControl,
      gamesByColor,
      recentGames: games.slice(0, 5)
    };
  }
}

export const gameService = new GameService();

