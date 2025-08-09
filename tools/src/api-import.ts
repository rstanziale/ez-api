import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';
import { PROJECTS_DIR, TMP_DIR } from './const/api-const';

/**
 * Create a temporary project directory.
 * @param projectDir target project directory
 */
export const createTmpProjectDir = (projectDir: string): void => {
  const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
  mkdirSync(targetDir, { recursive: true });
};

/**
 * Delete a temporary project directory.
 * @param projectDir target project directory
 */
export const deleteTmpProjectDir = (projectDir: string): void => {
  const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
  rmSync(targetDir, { recursive: true });
};

/**
 * Import OpenAPI Specification file into a temporary project directory.
 * @param projectDir target project directory
 * @param pathFile path to the OpenAPI Specification file
 * @see https://typespec.io/docs/emitters/openapi3/cli/#converting-openapi-3-into-typespec
 */
export const importOasFile = (projectDir: string, pathFile: string): void => {
  const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
  execSync(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
};

/**
 * Copy the main file to the target project directory.
 * @param projectDir target project directory
 */
export const copyMainFileToProjectDir = (projectDir: string): void => {
  const tmpDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
  const targetDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);

  const tmpMainFile = resolve(tmpDir, 'main.tsp');
  const targetMainFile = resolve(targetDir, 'main.tsp');

  copyFileSync(tmpMainFile, targetMainFile);
};
