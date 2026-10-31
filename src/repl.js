import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { handleCommand } from './commands.js';

const COMMANDS = [
  'add',
  'list',
  'get',
  'update',
  'status',
  'delete',
  'help',
  'exit',
];

function tokenize(line) {
  const tokens = [];
  let current = '';
  let quote = null;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ' ') {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export async function startRepl() {
  const rl = readline.createInterface({
    input,
    output,
    completer: line => {
      const hits = COMMANDS.filter(c => c.startsWith(line));
      return [hits.length ? hits : COMMANDS, line];
    },
  });

  console.log('To-Do CLI — интерактивный режим');
  console.log('Введите "help" для справки, "exit" или Ctrl+D для выхода.\n');

  rl.setPrompt('todo> ');
  rl.prompt();

  let sigintCount = 0;

  rl.on('SIGINT', () => {
    if (rl.line) {
      rl.write(null, { ctrl: true, name: 'u' });
      sigintCount = 0;
      return;
    }
    sigintCount++;
    if (sigintCount >= 2) {
      console.log('\nВыход.');
      rl.close();
    } else {
      console.log('\n(нажмите Ctrl+C ещё раз для выхода)');
      rl.prompt();
    }
  });

  for await (const rawLine of rl) {
    const line = rawLine.trim();

    if (!line) {
      rl.prompt();
      continue;
    }

    if (line === 'exit' || line === 'quit') {
      console.log('Выход.');
      break;
    }

    const argv = tokenize(line);

    try {
      await handleCommand(argv);
    } catch (err) {
      console.error(`Ошибка: ${err.message}`);
    }

    process.exitCode = 0;
    rl.prompt();
  }

  rl.close();
}
