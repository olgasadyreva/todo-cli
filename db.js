import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Пул соединений переиспользуется всеми запросами приложения. Neon требует SSL.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // В локальном Postgres без SSL раскомментируйте строку ниже вместо require: true
    // require: false,
    rejectUnauthorized: false,
    require: true,
  },
});

// Колонки таблицы соответствуют camelCase-полям приложения (createdAt/updateAt).
const COLUMNS = 'id, title, status, "createdAt", "updateAt"';

/** Приводит запись из БД (updateAt) к полям приложения (updatedAt). */
function mapRow(row) {
  if (!row) return null;
  const { updateAt, ...rest } = row;
  return { ...rest, updatedAt: updateAt };
}

export async function insertTask(title) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, status, "createdAt")
     VALUES ($1, 'todo', now())
     RETURNING ${COLUMNS}`,
    [title],
  );
  return mapRow(rows[0]);
}

export async function selectAllTasks() {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM tasks ORDER BY id ASC`,
  );
  return rows.map(mapRow);
}

export async function selectTaskById(id) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM tasks WHERE id = $1`,
    [id],
  );
  return mapRow(rows[0]);
}

export async function updateTaskTitle(id, title) {
  const { rows } = await pool.query(
    `UPDATE tasks SET title = $1, "updateAt" = now()
     WHERE id = $2
     RETURNING ${COLUMNS}`,
    [title, id],
  );
  return mapRow(rows[0]);
}

export async function updateTaskStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE tasks SET status = $1, "updateAt" = now()
     WHERE id = $2
     RETURNING ${COLUMNS}`,
    [status, id],
  );
  return mapRow(rows[0]);
}

export async function deleteTaskById(id) {
  const { rows } = await pool.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING ${COLUMNS}`,
    [id],
  );
  return mapRow(rows[0]);
}
