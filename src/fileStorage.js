import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'storage');
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
