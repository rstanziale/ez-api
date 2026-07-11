import { exec } from 'node:child_process';

const createExecOptions = () => ({
  stdio: 'inherit' as const,
  encoding: 'utf8' as const,
});

const runCommand = async (command: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    exec(command, createExecOptions(), error => {
      if (error) {
        reject(error);
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
