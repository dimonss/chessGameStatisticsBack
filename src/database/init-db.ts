import db from './db';
import { runMigrations } from './migrations';
import { Player, ChessGame } from '../types/chess';

// Sample players data
const players: Player[] = [
  { id: '1', name: 'Alex Grandmaster', username: 'Grandmaster123', rating: 2450 },
  { id: '2', name: 'Maria ChessMaster', username: 'ChessMaster99', rating: 2320 },
  { id: '3', name: 'John Tactical', username: 'TacticalKing', rating: 2180 },
  { id: '4', name: 'Sarah Endgame', username: 'EndgameExpert', rating: 2250 },
  { id: '5', name: 'David Opening', username: 'OpeningTheory', rating: 2100 },
  { id: '6', name: 'Emma Speed', username: 'SpeedChess', rating: 1950 },
  { id: '7', name: 'Michael Positional', username: 'PositionalPlayer', rating: 2280 },
  { id: '8', name: 'Lisa Attack', username: 'AttackMode', rating: 2050 },
  { id: '9', name: 'Robert Defense', username: 'DefenseMaster', rating: 2150 },
  { id: '10', name: 'Anna Novice', username: 'ChessNovice', rating: 1650 }
];

function getRandomOpening(): string {
  const openings = [
    'Sicilian Defense',
    'Queen\'s Gambit',
    'Ruy Lopez',
    'French Defense',
    'Italian Game',
    'King\'s Indian Defense',
    'English Opening',
    'Nimzo-Indian Defense',
    'Catalan Opening',
    'Pirc Defense',
    'Caro-Kann Defense',
    'Scandinavian Defense',
    'London System',
    'Dutch Defense',
    'Grünfeld Defense'
  ];
  return openings[Math.floor(Math.random() * openings.length)];
}

function getRandomNote(): string {
  const notes = [
    'Great endgame technique',
    'Mistake in the opening',
    'Long endgame, well played by both',
    'Good tactical play',
    'Strong opening preparation',
    'Time trouble',
    'Excellent positional play',
    'Threefold repetition',
    'Good conversion of advantage',
    'Quick victory',
    'Brilliant combination',
    'Solid defense',
    'Aggressive play',
    'Patient endgame'
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

function generateGames(): ChessGame[] {
  const games: ChessGame[] = [];
  const playerIds = players.map(p => p.id);
  const timeControls: Array<'bullet' | 'blitz' | 'rapid' | 'classical'> = ['bullet', 'blitz', 'rapid', 'classical'];
  const results: Array<'win' | 'loss' | 'draw'> = ['win', 'loss', 'draw'];
  
  let gameId = 1;
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      const player1Id = playerIds[i];
      const player2Id = playerIds[j];
      
      const numGames = Math.floor(Math.random() * 3) + 2;
      
      for (let k = 0; k < numGames; k++) {
        const timeControl = timeControls[Math.floor(Math.random() * timeControls.length)];
        const result = results[Math.floor(Math.random() * results.length)];
        const color: 'white' | 'black' = Math.random() > 0.5 ? 'white' : 'black';
        const moves = Math.floor(Math.random() * 50) + 20;
        
        const baseRating1 = players.find(p => p.id === player1Id)!.rating;
        const baseRating2 = players.find(p => p.id === player2Id)!.rating;
        
        let ratingChange = 0;
        if (result === 'win') {
          ratingChange = Math.floor(Math.random() * 20) + 10;
        } else if (result === 'loss') {
          ratingChange = -(Math.floor(Math.random() * 20) + 10);
        }
        
        const ratingBefore = color === 'white' ? baseRating1 : baseRating2;
        const ratingAfter = ratingBefore + ratingChange;
        
        const date = new Date(baseDate);
        date.setDate(date.getDate() + gameId);
        
        games.push({
          id: `game-${gameId}`,
          date: date.toISOString().split('T')[0],
          playerId: player1Id,
          opponentId: player2Id,
          result: result,
          color: color,
          timeControl: timeControl,
          moves: moves,
          rating: {
            before: ratingBefore,
            after: ratingAfter,
            change: ratingChange
          },
          opening: getRandomOpening(),
          notes: getRandomNote()
        });
        
        gameId++;
        
        const reverseResult: 'win' | 'loss' | 'draw' = result === 'win' ? 'loss' : result === 'loss' ? 'win' : 'draw';
        const reverseColor: 'white' | 'black' = color === 'white' ? 'black' : 'white';
        const reverseRatingBefore = reverseColor === 'white' ? baseRating1 : baseRating2;
        const reverseRatingChange = -ratingChange;
        const reverseRatingAfter = reverseRatingBefore + reverseRatingChange;
        
        const date2 = new Date(baseDate);
        date2.setDate(date2.getDate() + gameId);
        
        games.push({
          id: `game-${gameId}`,
          date: date2.toISOString().split('T')[0],
          playerId: player2Id,
          opponentId: player1Id,
          result: reverseResult,
          color: reverseColor,
          timeControl: timeControls[Math.floor(Math.random() * timeControls.length)],
          moves: Math.floor(Math.random() * 50) + 20,
          rating: {
            before: reverseRatingBefore,
            after: reverseRatingAfter,
            change: reverseRatingChange
          },
          opening: getRandomOpening(),
          notes: getRandomNote()
        });
        
        gameId++;
      }
    }
  }
  
  return games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function seedDatabase() {
  console.log('🌱 Заполнение базы данных тестовыми данными...');
  
  // Clear existing data
  db.exec('DELETE FROM games');
  db.exec('DELETE FROM players');
  
  // Insert players
  const insertPlayer = db.prepare(`
    INSERT INTO players (id, name, username, rating, avatar)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const insertPlayerTransaction = db.transaction((players: Player[]) => {
    for (const player of players) {
      insertPlayer.run(player.id, player.name, player.username, player.rating, player.avatar || null);
    }
  });
  
  insertPlayerTransaction(players);
  console.log(`✅ Вставлено ${players.length} игроков`);
  
  // Insert games
  const games = generateGames();
  const insertGame = db.prepare(`
    INSERT INTO games (
      id, date, playerId, opponentId, result, color, timeControl, moves,
      ratingBefore, ratingAfter, ratingChange, opening, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertGameTransaction = db.transaction((games: ChessGame[]) => {
    for (const game of games) {
      insertGame.run(
        game.id,
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
    }
  });
  
  insertGameTransaction(games);
  console.log(`✅ Вставлено ${games.length} игр`);
}

function initDatabase(withSeed: boolean = false) {
  console.log('🚀 Инициализация базы данных...\n');
  
  try {
    // Run migrations
    console.log('📋 Запуск миграций...');
    runMigrations();
    console.log('✅ Миграции выполнены успешно\n');
    
    // Optionally seed database
    if (withSeed) {
      seedDatabase();
      console.log('\n✅ База данных успешно заполнена тестовыми данными');
    } else {
      console.log('ℹ️  База данных инициализирована. Для заполнения тестовыми данными используйте: npm run seed');
    }
    
    console.log('\n✨ Инициализация завершена!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const withSeed = args.includes('--seed') || args.includes('-s');

initDatabase(withSeed);

