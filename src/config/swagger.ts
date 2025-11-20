import swaggerJsdoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Chess Game Statistics API',
    version: '1.0.0',
    description:
      'REST API для управления игроками и партиями в приложении Chess Game Statistics. Все ответы возвращаются в формате JSON.'
  },
  servers: [
    {
      url: process.env.LINK_TO_PRODUCT,
      description: 'Production server'
    },
    {
      url: 'http://localhost:3001',
      description: 'Local development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Проверка состояния сервиса' },
    { name: 'Players', description: 'Управление игроками' },
    { name: 'Games', description: 'Управление партиями и статистикой' }
  ],
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
        description: 'Basic Authentication. Используйте учетные данные из .env файла (AUTH_USERNAME и AUTH_PASSWORD)'
      }
    },
    schemas: {
      Player: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Alex Grandmaster' },
          username: { type: 'string', example: 'Grandmaster123' },
          rating: { type: 'integer', example: 2450 },
          avatar: { type: 'string', nullable: true }
        },
        required: ['id', 'name', 'username', 'rating']
      },
      Rating: {
        type: 'object',
        properties: {
          before: { type: 'integer', example: 2100 },
          after: { type: 'integer', example: 2115 },
          change: { type: 'integer', example: 15 }
        },
        required: ['before', 'after', 'change']
      },
      ChessGame: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'game-1' },
          date: { type: 'string', format: 'date', example: '2024-01-01' },
          playerId: { type: 'string', example: '1' },
          opponentId: { type: 'string', example: '2' },
          result: { type: 'string', enum: ['win', 'loss', 'draw'] },
          color: { type: 'string', enum: ['white', 'black'] },
          timeControl: { type: 'string', enum: ['bullet', 'blitz', 'rapid', 'classical'] },
          moves: { type: 'integer', example: 42 },
          rating: { $ref: '#/components/schemas/Rating' },
          opening: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true }
        },
        required: [
          'id',
          'date',
          'playerId',
          'opponentId',
          'result',
          'color',
          'timeControl',
          'moves',
          'rating'
        ]
      },
      CreatePlayerInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          username: { type: 'string' },
          rating: { type: 'integer' },
          avatar: { type: 'string', nullable: true }
        },
        required: ['name', 'username', 'rating']
      },
      UpdatePlayerInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          username: { type: 'string' },
          rating: { type: 'integer' },
          avatar: { type: 'string', nullable: true }
        }
      },
      CreateGameInput: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date' },
          playerId: { type: 'string' },
          opponentId: { type: 'string' },
          result: { type: 'string', enum: ['win', 'loss', 'draw'] },
          color: { type: 'string', enum: ['white', 'black'] },
          timeControl: { type: 'string', enum: ['bullet', 'blitz', 'rapid', 'classical'] },
          moves: { type: 'integer' },
          rating: { $ref: '#/components/schemas/Rating' },
          opening: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true }
        },
        required: [
          'date',
          'playerId',
          'opponentId',
          'result',
          'color',
          'timeControl',
          'moves',
          'rating'
        ]
      },
      UpdateGameInput: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date' },
          playerId: { type: 'string' },
          opponentId: { type: 'string' },
          result: { type: 'string', enum: ['win', 'loss', 'draw'] },
          color: { type: 'string', enum: ['white', 'black'] },
          timeControl: { type: 'string', enum: ['bullet', 'blitz', 'rapid', 'classical'] },
          moves: { type: 'integer' },
          rating: { $ref: '#/components/schemas/Rating', nullable: true },
          opening: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true }
        }
      },
      GameStatistics: {
        type: 'object',
        properties: {
          totalGames: { type: 'integer', example: 120 },
          wins: { type: 'integer', example: 60 },
          losses: { type: 'integer', example: 40 },
          draws: { type: 'integer', example: 20 },
          winRate: { type: 'number', format: 'float', example: 50.0 },
          averageRating: { type: 'integer', example: 2120 },
          ratingChange: { type: 'integer', example: 120 },
          gamesByTimeControl: {
            type: 'object',
            properties: {
              bullet: { type: 'integer', example: 10 },
              blitz: { type: 'integer', example: 40 },
              rapid: { type: 'integer', example: 50 },
              classical: { type: 'integer', example: 20 }
            }
          },
          gamesByColor: {
            type: 'object',
            properties: {
              white: { type: 'integer', example: 65 },
              black: { type: 'integer', example: 55 }
            }
          },
          recentGames: {
            type: 'array',
            items: { $ref: '#/components/schemas/ChessGame' }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Player not found' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Проверка состояния API',
        responses: {
          200: {
            description: 'Сервис работает',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'Chess Statistics API is running' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/players': {
      get: {
        tags: ['Players'],
        summary: 'Получить список игроков',
        responses: {
          200: {
            description: 'Список игроков',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Player' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Players'],
        summary: 'Создать нового игрока',
        security: [{ basicAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePlayerInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Игрок создан',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Player' }
              }
            }
          },
          400: {
            description: 'Неверные данные',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          409: {
            description: 'Имя пользователя занято',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/players/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID игрока'
        }
      ],
      get: {
        tags: ['Players'],
        summary: 'Получить игрока по ID',
        responses: {
          200: {
            description: 'Игрок найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Player' }
              }
            }
          },
          404: {
            description: 'Игрок не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Players'],
        summary: 'Обновить данные игрока',
        security: [{ basicAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePlayerInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Игрок обновлен',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Player' }
              }
            }
          },
          404: {
            description: 'Игрок не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Players'],
        summary: 'Удалить игрока',
        security: [{ basicAuth: [] }],
        responses: {
          204: { description: 'Игрок удален' },
          404: {
            description: 'Игрок не найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/games': {
      get: {
        tags: ['Games'],
        summary: 'Получить список игр (опционально по игроку)',
        parameters: [
          {
            name: 'playerId',
            in: 'query',
            schema: { type: 'string' },
            description: 'ID игрока для фильтрации'
          }
        ],
        responses: {
          200: {
            description: 'Список игр',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ChessGame' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Games'],
        summary: 'Создать новую игру',
        security: [{ basicAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateGameInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Игра создана',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChessGame' }
              }
            }
          },
          400: {
            description: 'Неверные данные',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/games/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID игры'
        }
      ],
      get: {
        tags: ['Games'],
        summary: 'Получить игру по ID',
        responses: {
          200: {
            description: 'Игра найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChessGame' }
              }
            }
          },
          404: {
            description: 'Игра не найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Games'],
        summary: 'Обновить данные игры',
        security: [{ basicAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateGameInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Игра обновлена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChessGame' }
              }
            }
          },
          404: {
            description: 'Игра не найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Games'],
        summary: 'Удалить игру',
        security: [{ basicAuth: [] }],
        responses: {
          204: { description: 'Игра удалена' },
          404: {
            description: 'Игра не найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Требуется аутентификация',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/games/player/{playerId}': {
      parameters: [
        {
          name: 'playerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID игрока'
        }
      ],
      get: {
        tags: ['Games'],
        summary: 'Получить игры конкретного игрока',
        responses: {
          200: {
            description: 'Список игр игрока',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ChessGame' }
                }
              }
            }
          }
        }
      }
    },
    '/api/games/player/{playerId}/statistics': {
      parameters: [
        {
          name: 'playerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID игрока'
        }
      ],
      get: {
        tags: ['Games'],
        summary: 'Получить статистику игрока',
        responses: {
          200: {
            description: 'Статистика игрока',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GameStatistics' }
              }
            }
          }
        }
      }
    }
  }
};

export const swaggerSpec = swaggerJsdoc({
  definition,
  apis: []
});


