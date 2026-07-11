import { execSync } from 'node:child_process';
import { join, resolve } from 'node:path';

import { ARCHETYPE_TSP_CONFIG, PROJECTS_DIR } from './const/api-const.ts';

const __dirname = import.meta.dirname;

/**
 * Get list of compile command for a project
 * @param projectDir name of directory where to find config.json files
 * @returns command list to execute
 */
export const getCompileCommands = (projectDir: string): string[] => {
  const compileFilesExt = ['yaml'];

  return compileFilesExt.map(ext => {
    const configDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);
    const tspConfigFile = join(configDir, `${ARCHETYPE_TSP_CONFIG}.${ext}`);

    return `tsp compile projects/${projectDir}/main.tsp --config "${tspConfigFile}"`;
  });
};

/**
 * Run a command in the shell
 * @param command to execute
 */
export const runCommand = (command: string): void => {
  execSync(command);
};
