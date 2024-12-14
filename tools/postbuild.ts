import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { readJSONSync } from 'fs-extra';
import { join, resolve } from 'path';

const postBuild = (): void => {
  const projectDir: string = process.argv[2];

  try {
    const version = getVersion(projectDir);
    console.log(`Generating API documentation ${version} for project ${projectDir}...`);

    const files = getFilenames(projectDir);
    setDistFiles(files, projectDir, version);

    console.log(`API documentation for ${projectDir} generated successfully`);
  } catch (e) {
    console.error(`Failed to generate API documentation for project ${projectDir}`);
    console.error(e);
  }
};

/**
 * Get config.json version attribute
 * If not present, return 0.0.0
 * @param projectDir name of directory where to find config file
 * @returns string value
 */
const getVersion = (projectDir: string): string => {
  const configDir = resolve(__dirname, '..', 'projects', projectDir);
  const configJson = readJSONSync(join(configDir, 'config.json'));

  return configJson['version'] ?? '0.0.0';
};

/**
 * Get list of dist filename according config.json filename attribute
 * @param projectDir name of directory where to find config file
 * @returns list of string
 */
const getFilenames = (projectDir: string): string[] => {
  const configDir = resolve(__dirname, '..', 'projects', projectDir);
  const configJson = readJSONSync(join(configDir, 'config.json'));
  const filename = configJson['filename'] ?? 'api';

  return ['json', 'yaml'].map(ext => `${filename}-x.y.z.${ext}`);
};

/**
 * Iterate list of file and create dist file for each one
 * @param files list of file to analyze
 * @param projectDir name of directory where to find config.json
 * @param version to apply
 */
const setDistFiles = (files: string[] = [], projectDir: string, version: string): void => {
  files.forEach(file => {
    // Read source content file
    const sourceDir = resolve(__dirname, '..', 'doc', `api-${projectDir}`);
    const contentFile = readFileSync(join(sourceDir, file));

    // Set new filename
    const newFilename = setFilenameVersion(file, version);

    // Create dist folder if any and write target content
    const targetDir = resolve(__dirname, '..', 'dist', `api-${projectDir}`);
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
export const setFilenameVersion = (name: string, version: string): string => {
  const pattern = /x\.y\.z/;

  return name.replace(pattern, version);
};

postBuild();
