import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: string;
}

export const basicAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Basic authentication required. Please provide Authorization header with Basic auth.'
    });
    return;
  }

  // Извлекаем base64 строку
  const base64Credentials = authHeader.split(' ')[1];
  
  try {
    // Декодируем base64
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Получаем учетные данные из переменных окружения
    const envUsername = process.env.AUTH_USERNAME;
    const envPassword = process.env.AUTH_PASSWORD;

    if (!envUsername || !envPassword) {
      console.error('AUTH_USERNAME and AUTH_PASSWORD must be set in .env file');
      res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Authentication is not properly configured'
      });
      return;
    }

    // Проверяем учетные данные
    if (username === envUsername && password === envPassword) {
      req.user = username;
      next();
    } else {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid authorization header format'
    });
  }
};

