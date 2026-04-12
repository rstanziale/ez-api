import { execSync } from 'node:child_process';

/**
 * Get list of compile command for a project
 * @param projectDir name of directory where to find config.json files
 * @returns command list to execute
 */
export const getCompileCommands = (projectDir: string): string[] => {
  const compileFilesExt = ['yaml'];

  return compileFilesExt.map(ext => {
    const tspConfigFile = `./projects/${projectDir}/tspconfig.${ext}`;

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
