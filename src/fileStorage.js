import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

// Папка пользователя, например:
//   Linux/macOS: /home/username
//   Windows:     C:\Users\username
const HOME = os.homedir();

// Скрытая папка приложения в домашней директории пользователя
const DATA_DIR = path.join(HOME, '.todo-cli');

// Один файл со всеми задачами
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureStorage() {
  try {
    await access(DATA_FILE);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export async function readTasks() {
  await ensureStorage();
  const raw = await readFile(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

export async function writeTasks(tasks) {
  await ensureStorage();
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// Полезно для отладки и для команды `where` (см. ниже)
export function getStoragePath() {
  return DATA_FILE;
}
