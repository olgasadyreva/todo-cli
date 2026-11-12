import * as service from './taskService.js';

const STATUS_TRANSLATIONS = {
  todo: 'В работе',
  'in-progress': 'В работе',
  done: 'Выполнена',
};

export async function handleCommand(argv) {
  const [command, ...args] = argv;

  if (!command) {
    return;
  }

  try {
    switch (command) {
      case 'add': {
        const title = args.join(' ');
        const task = await service.addTask(title);
        console.log(`Задача добавлена с идентификатором ${task.id}`);
        break;
      }

      case 'list': {
        const tasks = await service.listTasks();
        if (tasks.length === 0) {
          console.log('Список задач пуст');
          break;
        }
        console.log('Список задач:');
        tasks.forEach(task => {
          const statusRu = STATUS_TRANSLATIONS[task.status] || task.status;
          console.log(`${task.id}. [${statusRu}] ${task.title}`);
        });
        break;
      }

      case 'get': {
        const task = await service.getTask(args[0]);
        const statusRu = STATUS_TRANSLATIONS[task.status] || task.status;
        console.log(`Задача с идентификатором ${task.id}:`);
        console.log(`Название: ${task.title}`);
        console.log(`Статус: ${statusRu}`);
        if (task.createdAt) {
          console.log(`Создана: ${new Date(task.createdAt).toLocaleString()}`);
        }
        if (task.updatedAt) {
          console.log(`Обновлена: ${new Date(task.updatedAt).toLocaleString()}`);
        }
        break;
      }

      case 'update': {
        const [id, ...rest] = args;
        const task = await service.updateTask(id, rest.join(' '));
        console.log(`Задача с идентификатором ${task.id} обновлена`);
        break;
      }

      case 'status': {
        const [id, newStatus] = args;
        const task = await service.updateStatus(id, newStatus);
        console.log(`Статус задачи с идентификатором ${task.id} обновлён`);
        break;
      }

      case 'delete': {
        const task = await service.deleteTask(args[0]);
        console.log(`Задача с идентификатором ${task.id} удалена`);
        break;
      }

      case 'help': {
        printHelp();
        break;
      }

      default:
        console.log('Неверная команда');
        process.exitCode = 1;
    }
  } catch (err) {
    console.error(`Ошибка: ${err.message}`);
    process.exitCode = 1;
  }
}

export function printHelp() {
  console.log(`
Доступные команды:
  add <task>                добавить новую задачу
  list                      вывести список всех задач
  get <id>                  вывести информацию о задаче
  update <id> <newTask>     обновить название задачи
  status <id> <newStatus>   обновить статус (todo | in-progress | done)
  delete <id>               удалить задачу
  help                      показать эту справку
  exit                      выйти из интерактивного режима
`);
}
