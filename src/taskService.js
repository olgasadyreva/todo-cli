import {
  insertTask,
  selectAllTasks,
  selectTaskById,
  updateTaskTitle,
  updateTaskStatus,
  deleteTaskById,
} from '../db.js';

export const STATUSES = ['todo', 'in-progress', 'done'];

function normalizeStatus(input) {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();
  if (['todo', 'в работе'].includes(s)) return 'todo';
  if (['in-progress', 'in progress'].includes(s)) return 'in-progress';
  if (['done', 'выполнена', 'выполнено'].includes(s)) return 'done';
  return null;
}

function toId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Некорректный идентификатор задачи: ${id}`);
  }
  return parsed;
}

export async function addTask(title) {
  if (!title || !title.trim()) {
    throw new Error('Название задачи не может быть пустым');
  }
  return insertTask(title.trim());
}

export async function listTasks() {
  return selectAllTasks();
}

export async function getTask(id) {
  const task = await selectTaskById(toId(id));
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  return task;
}

export async function updateTask(id, newTitle) {
  if (!newTitle || !newTitle.trim()) {
    throw new Error('Новое название не может быть пустым');
  }
  const task = await updateTaskTitle(toId(id), newTitle.trim());
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  return task;
}

export async function updateStatus(id, newStatus) {
  const normalized = normalizeStatus(newStatus);
  if (!normalized) {
    throw new Error(`Недопустимый статус: ${newStatus}`);
  }
  const task = await updateTaskStatus(toId(id), normalized);
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  return task;
}

export async function deleteTask(id) {
  const task = await deleteTaskById(toId(id));
  if (!task) throw new Error(`Задача с id=${id} не найдена`);
  return task;
}
