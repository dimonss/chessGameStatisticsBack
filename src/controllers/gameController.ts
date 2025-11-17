import { Request, Response } from 'express';
import { gameService } from '../services/gameService';

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const playerId = req.query.playerId as string | undefined;
    const games = gameService.getAllGames(playerId);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = gameService.getGameById(id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

export const getPlayerGames = async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const games = gameService.getGamesByPlayerId(playerId);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player games' });
  }
};

export const getPlayerStatistics = async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const statistics = gameService.getPlayerStatistics(playerId);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player statistics' });
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const {
      date,
      playerId,
      opponentId,
      result,
      color,
      timeControl,
      moves,
      rating,
      opening,
      notes
    } = req.body;
    
    if (!date || !playerId || !opponentId || !result || !color || !timeControl || moves === undefined || !rating) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, playerId, opponentId, result, color, timeControl, moves, rating' 
      });
    }
    
    if (!rating.before || !rating.after || rating.change === undefined) {
      return res.status(400).json({ 
        error: 'Rating object must contain: before, after, change' 
      });
    }
    
    const game = gameService.createGame({
      date,
      playerId,
      opponentId,
      result,
      color,
      timeControl,
      moves,
      rating,
      opening,
      notes
    });
    
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
};

export const updateGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const game = gameService.updateGame(id, updates);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = gameService.deleteGame(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

