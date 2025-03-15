import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const PROJECT_NAME = /\#{PROJECT_NAME}/g;
const PROJECT_NAMESPACE = /\#{PROJECT_NAMESPACE}/g;

/**
 * Check if project directory exists
 * @param projectDir target project directory
 * @returns true if project directory exists, false otherwise
 */
export const existProjectDir = (projectDir: string): boolean => {
  const targetDir = resolve(__dirname, '..', '..', 'projects', projectDir);
  return existsSync(targetDir);
};

/**
 * Create new project directory
 * @param projectDir target project directory
 */
export const createProjectDir = (projectDir: string): void => {
  const targetDir = resolve(__dirname, '..', '..', 'projects', projectDir);
  mkdirSync(targetDir, { recursive: true });
};

/**
 * Create config.json file
 * @param projectDir target project directory
 */
export const createConfigFile = (projectDir: string): void => {
  // Read from archetype dir config.json file
  const sourceDir = resolve(__dirname, '..', 'api-archetype');
  const configJsonFile = readFileSync(join(sourceDir, 'config.json'), 'utf-8');
  const configJson = JSON.parse(configJsonFile);

  // Override placeholder
  configJson['filename'] = configJson['filename'].replace(PROJECT_NAME, projectDir);

  // Write file on project dir
  const targetDir = resolve(__dirname, '..', '..', 'projects', projectDir);
  writeFileSync(join(targetDir, 'config.json'), JSON.stringify(configJson, null, 2));
};

/**
 * Create tsp files
 * @param projectDir target project directory
 */
export const createTspFiles = (projectDir: string): void => {
  const sourceDir = resolve(__dirname, '..', 'api-archetype');

  ['tspconfig-json', 'tspconfig-yaml'].forEach((filename: string) => {
    // Read from archetype dir config.json file
    let file = readFileSync(join(sourceDir, filename), 'utf-8');

    // Override placeholder
    file = file.replace(PROJECT_NAME, projectDir);

    // Write file on project dir
    const targetDir = resolve(__dirname, '..', '..', 'projects', projectDir);
    writeFileSync(join(targetDir, `${filename}.yaml`), file);
  });
};

/**
 * Create main file
 * @param projectDir target project directory
 */
export const createMainFile = (projectDir: string): void => {
  // Read from archetype dir config.json file
  const sourceDir = resolve(__dirname, '..', 'api-archetype');
  let main = readFileSync(join(sourceDir, 'main'), 'utf-8');

  // Override placeholder
  main = main
    .replace(PROJECT_NAME, toSentence(projectDir))
    .replace(PROJECT_NAMESPACE, toCamelCase(projectDir));

  // Write file on project dir
  const targetDir = resolve(__dirname, '..', '..', 'projects', projectDir);
  writeFileSync(join(targetDir, 'main.tsp'), main);
};

/**
 * Update package.json with new scripts
 * @param projectDir target project directory
 */
export const updatePackageJson = (projectDir: string): void => {
  // Read package.json file
  const sourceDir = resolve(__dirname, '..', '..');
  const packageJsonFile = readFileSync(join(sourceDir, 'package.json'), 'utf-8');
  const packageJson = JSON.parse(packageJsonFile);

  // Update scripts
  packageJson['scripts'][`compile:${projectDir}`] =
    `npm-run-all --parallel compile-yaml:${projectDir} compile-json:${projectDir}`;
  packageJson['scripts'][`postcompile:${projectDir}`] =
    `ts-node --project tools/tsconfig.json tools/postbuild.ts ${projectDir}`;
  packageJson['scripts'][`compile-yaml:${projectDir}`] =
    `tsp compile projects/${projectDir}/main.tsp --config \"./projects/${projectDir}/tspconfig-yaml.yaml\"`;
  packageJson['scripts'][`compile-json:${projectDir}`] =
    `tsp compile projects/${projectDir}/main.tsp --config \"./projects/${projectDir}/tspconfig-json.yaml\"`;
  packageJson['scripts'][`watch:${projectDir}`] =
    `tsp compile projects/${projectDir}/main.tsp --watch --emit @typespec/openapi3`;

  // Update build all script
  const buildAllScript = packageJson['scripts']['build:all'];
  packageJson['scripts']['build:all'] = buildAllScript.concat(` compile:${projectDir}`);

  // Write package.json
  writeFileSync(join(sourceDir, 'package.json'), JSON.stringify(packageJson, null, 2));
};

/**
 * Utility function.
 *
 * Return input as CamelCase
 * @param input string to transform
 */
export const toCamelCase = (input: string): string => {
  if (!input) throw new Error('Input is required');

  // Remove special characters and split by hyphen
  const words = input.split(/[-_]/);

  // Capitalize first letter of each word and join
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

/**
 * Utility function.
 *
 * Return input as sentence like Word1 Word2
 * @param input string to transform
 */
export const toSentence = (input: string): string => {
  if (!input) throw new Error('Input is required');

  // Remove special characters and split by hyphen
  const words = input.split(/[-_]/);

  // Create sentence format with space between words
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
