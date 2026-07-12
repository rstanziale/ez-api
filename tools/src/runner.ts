import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const createExecOptions = () => ({
  stdio: 'inherit' as const,
  encoding: 'utf8' as const,
});

const runCommand = async (command: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    console.log(`Running command: ${command}`);
    exec(command, createExecOptions(), error => {
      if (error) {
        reject(error as Error);
        return;
      }

      resolve();
    });
  });
};

export const runSequential = async (commands: string[]): Promise<void> => {
  for (const command of commands) {
    await runCommand(command);
  }
};

export const runParallel = async (commands: string[]): Promise<void> => {
  await Promise.all(commands.map(command => runCommand(command)));
};

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
  const packageJsonPath = resolve(import.meta.dirname, '..', '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    scripts?: Record<string, string>;
  };

  return new Set(Object.keys(packageJson.scripts ?? {}));
};

export const buildCommands = (task: string, scripts: Set<string>): string[] => {
  if (scripts.has(task)) {
    return [`pnpm run ${task}`];
  }

  return [task];
};
