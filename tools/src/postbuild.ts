import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARCHETYPE_CONFIG_FILE, PROJECTS_DIR } from './const/api-const.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get config.json version attribute
 * If not present, return 0.0.0
 * @param projectDir name of directory where to find config file
 * @returns string value
 */
export const getVersion = (projectDir: string): string => {
  const configDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);
  const configJsonFile = readFileSync(join(configDir, ARCHETYPE_CONFIG_FILE), 'utf-8');
  const configJson = JSON.parse(configJsonFile);

  return configJson['version'] ?? '0.0.0';
};

/**
 * Get list of dist filename according config.json filename attribute
 * @param projectDir name of directory where to find config file
 * @returns list of string
 */
export const getFilenames = (projectDir: string): string[] => {
  const configDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);
  const configJsonFile = readFileSync(join(configDir, ARCHETYPE_CONFIG_FILE), 'utf-8');
  const configJson = JSON.parse(configJsonFile);
  const filename = configJson['filename'] ?? 'api';

  return ['json', 'yaml'].map(ext => `${filename}-x.y.z.${ext}`);
};

/**
 * Iterate list of file and create dist file for each one
 * @param projectDir name of directory where to find config.json
 * @param version to apply
 * @param files list of file to analyze
 */
export const setDistFiles = (projectDir: string, version: string, files: string[] = []): void => {
  files.forEach(file => {
    // Read source content file
    const sourceDir = resolve(__dirname, '..', '..', 'doc', `api-${projectDir}`);
    const contentFile = readFileSync(join(sourceDir, file), 'utf-8');

    // Set new filename
    const newFilename = setFilenameVersion(file, version);

    // Create dist folder if any and write target content
    const targetDir = resolve(__dirname, '..', '..', 'dist', `api-${projectDir}`);
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, newFilename), contentFile);
  });
};

/**
 * Replace version placeholder with input taken as input
 * @param name source filename
 * @param version string to apply
 * @returns new filename
 */
export const setFilenameVersion = (name: string, version: string = '0.0.0'): string => {
  if (!name) throw new Error('Filename is required');
  const pattern = /x\.y\.z/;

  return name.replace(pattern, version);
};
