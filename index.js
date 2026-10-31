#!/usr/bin/env node
import { handleCommand } from './src/commands.js';
import { startRepl } from './src/repl.js';

const args = process.argv.slice(2);

try {
  if (args.length === 0) {
    // Интерактивный режим
    await startRepl();
  } else {
    // Одиночная команда
    await handleCommand(args);
  }
} catch (err) {
  console.error(`❌ Ошибка: ${err.message}`);
  process.exitCode = 1;
}
