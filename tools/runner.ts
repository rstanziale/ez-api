import {
  buildCommands,
  getPackageScripts,
  parseMode,
  parseTasks,
  runParallel,
  runSequential,
} from './src/runner.ts';

const runTasks = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
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

try {
  await runTasks();
  console.log('All tasks completed successfully.');
} catch (error) {
  console.error('An error occurred while running tasks:');
  console.error(error);

  process.exitCode = 1;
}
