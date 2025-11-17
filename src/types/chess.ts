export type GameResult = 'win' | 'loss' | 'draw';

export type TimeControl = 'bullet' | 'blitz' | 'rapid' | 'classical';

export interface Player {
  id: string;
  name: string;
  username: string;
  rating: number;
  avatar?: string;
}

export interface ChessGame {
  id: string;
  date: string;
  playerId: string;
  opponentId: string;
  result: GameResult;
  color: 'white' | 'black';
  timeControl: TimeControl;
  moves: number;
  rating: {
    before: number;
    after: number;
    change: number;
  };
  opening?: string;
  notes?: string;
}

export interface GameStatistics {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageRating: number;
  ratingChange: number;
  gamesByTimeControl: Record<TimeControl, number>;
  gamesByColor: {
    white: number;
    black: number;
  };
  recentGames: ChessGame[];
}

