import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

const defaultEnvContent = `PORT=3001
NODE_ENV=development
DATABASE_PATH=./chess_statistics.db
AUTH_USERNAME=admin
AUTH_PASSWORD=changeme
`;

function createEnvFile() {
  // Проверяем, существует ли уже .env файл
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Файл .env уже существует. Пропускаем создание.');
    return;
  }

  // Проверяем, есть ли .env.example
  if (fs.existsSync(envExamplePath)) {
    // Копируем из .env.example
    const exampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    fs.writeFileSync(envPath, exampleContent, 'utf-8');
    console.log('✅ Файл .env создан из .env.example');
  } else {
    // Создаем с дефолтными значениями
    fs.writeFileSync(envPath, defaultEnvContent, 'utf-8');
    console.log('✅ Файл .env создан с дефолтными значениями');
  }
}

createEnvFile();

