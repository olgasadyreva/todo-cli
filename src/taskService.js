import { readTasks, writeTasks } from './fileStorage.js';

export const STATUSES = ['todo', 'in-progress', 'done'];

function normalizeStatus(input) {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();
  if (['todo', 'в работе', 'in-progress', 'in progress'].includes(s))
    return 'todo';
  if (['done', 'выполнена', 'выполнено'].includes(s)) return 'done';
  return null;
}

export async function addTask(title) {
  if (!title || !title.trim()) {
    throw new Error('Название задачи не может быть пустым');
  }
  const tasks = await readTasks();
  const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const task = {
    id: nextId,
    title: title.trim(),
    status: 'todo',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

export async function listTasks() {
  return readTasks();
}

export async function getTask(id) {
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === Number(id));
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  return task;
}

export async function updateTask(id, newTitle) {
  if (!newTitle || !newTitle.trim()) {
    throw new Error('Новое название не может быть пустым');
  }
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === Number(id));
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  task.title = newTitle.trim();
  task.updatedAt = new Date().toISOString();
  await writeTasks(tasks);
  return task;
}

export async function updateStatus(id, newStatus) {
  const normalized = normalizeStatus(newStatus);
  if (!normalized) {
    throw new Error(`Недопустимый статус: ${newStatus}`);
  }
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === Number(id));
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  task.status = normalized;
  task.updatedAt = new Date().toISOString();
  await writeTasks(tasks);
  return task;
}

export async function deleteTask(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error(`Задача с id=${id} не найдена`);
  const [removed] = tasks.splice(index, 1);
  await writeTasks(tasks);
  return removed;
}
