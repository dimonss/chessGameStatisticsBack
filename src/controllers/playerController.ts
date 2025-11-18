import { Request, Response } from 'express';
import { playerService } from '../services/playerService';

export const getAllPlayers = async (req: Request, res: Response) => {
  try {
    // Return players with statistics to avoid N+1 queries on frontend
    const players = playerService.getAllPlayersWithStats();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const player = playerService.getPlayerById(id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
};

export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { name, username, rating, avatar } = req.body;
    
    if (!name || !username || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, username, rating' });
    }
    
    const existingPlayer = playerService.getPlayerByUsername(username);
    if (existingPlayer) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    const player = playerService.createPlayer({ name, username, rating, avatar });
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create player' });
  }
};

export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const player = playerService.updatePlayer(id, updates);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update player' });
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = playerService.deletePlayer(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
};

