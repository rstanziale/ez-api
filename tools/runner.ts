import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runParallel, runSequential } from './src/runner.ts';

export const parseMode = (args: string[]): 'sequential' | 'parallel' => {
  const mode = args[0];

  if (mode === '-p') {
    return 'parallel';
  }

  return 'sequential';
};

export const parseTasks = (args: string[]): string[] =>
  args.filter(arg => arg !== '-s' && arg !== '-p');

export const getPackageScripts = (): Set<string> => {
  const packageJsonPath = resolve(import.meta.dirname, '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    scripts?: Record<string, string>;
  };

  return new Set(Object.keys(packageJson.scripts ?? {}));
};

export const buildCommands = (task: string, scripts: Set<string>): string[] => {
  if (scripts.has(task)) {
    return [`npm run ${task}`];
  }

  return [task];
};

export const runTasks = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
  const mode = parseMode(argv);
  const tasks = parseTasks(argv);
  const packageScripts = getPackageScripts();
  const commands = tasks.flatMap(task => buildCommands(task, packageScripts));

  if (commands.length === 0) {
    return;
  }

  if (mode === 'parallel') {
    await runParallel(commands);
    return;
  }

  await runSequential(commands);
};

// Only run the CLI entry point when this file is executed directly, not when it is imported by tests or other modules.
const isDirectExecution = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectExecution) {
  try {
    await runTasks();
    console.log('All tasks completed successfully.');
  } catch (error) {
    console.error('An error occurred while running tasks:');
    console.error(error);
    process.exitCode = 1;
  }
}
