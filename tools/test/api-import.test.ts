import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { fs, vol } from 'memfs';
import { beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest';

import {
  copyMainFileToProjectDir,
  createTmpProjectDir,
  deleteTmpProjectDir,
  importOasFile,
} from '../src/api-import.ts';
import { PROJECTS_DIR, TMP_DIR } from '../src/const/api-const.ts';

// Tell vitest to use fs mock from __mocks__ folder
// This can be done in a setup file if fs should always be mocked
vi.mock('node:fs');
vi.mock('node:fs/promises');
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

describe.concurrent('api:import scripts', () => {
  beforeAll(() => {
    // Reset the state of in-memory fs
    vol.reset();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTmpProjectDir', () => {
    test.each([['test-project'], [''], ['nested/dir/project']])(
      'should create a temporary project directory for projectDir: %s',
      projectDir => {
        // Arrange
        vi.spyOn(fs, 'mkdirSync');

        // Act
        createTmpProjectDir(projectDir);

        // Assert
        expect(mkdirSync).toHaveBeenCalledWith(
          resolve(__dirname, '..', '..', TMP_DIR, projectDir),
          {
            recursive: true,
          }
        );
      }
    );
  });

  describe('deleteTmpProjectDir', () => {
    test.each([['test-project'], [''], ['nested/dir/project']])(
      'should delete a temporary project directory for projectDir: %s',
      projectDir => {
        // Arrange
        vi.spyOn(fs, 'rmSync');
        mkdirSync(resolve(__dirname, '..', '..', TMP_DIR, projectDir), { recursive: true });

        // Act
        deleteTmpProjectDir(projectDir);

        // Assert
        expect(rmSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
          recursive: true,
        });
      }
    );
  });

  describe('importOasFile', () => {
    test.each([
      ['test-project', 'api.yaml'],
      ['', 'api.yaml'],
      ['proj', 'my api.yaml'],
    ])(
      'should execute tsp-openapi3 command for projectDir: %s and pathFile: %s',
      (projectDir, pathFile) => {
        // Arrange
        const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);

        // Act
        importOasFile(projectDir, pathFile);

        // Assert
        expect(execSync).toHaveBeenCalledWith(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
      }
    );
  });

  describe('copyMainFileToProjectDir', () => {
    it('should copy main.tsp from tmp to project dir', () => {
      vi.spyOn(fs, 'copyFileSync');
      const projectDir = 'test-project';

      const tmpDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
      const targetDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);
      const tmpMainFile = resolve(tmpDir, 'main.tsp');
      const targetMainFile = resolve(targetDir, 'main.tsp');

      // Create a mock directory with source files
      vol.fromJSON(
        {
          [join(tmpDir, 'main.tsp')]: 'import "@typespec/http";',
        },
        tmpDir
      );

      // Create a mock directory with target files
      vol.fromJSON(
        {
          [join(targetDir, 'main.tsp')]: 'import "@typespec/http";',
        },
        targetDir
      );

      copyMainFileToProjectDir(projectDir);

      expect(copyFileSync).toHaveBeenCalledWith(tmpMainFile, targetMainFile);
    });

    it('should handle nested projectDir', () => {
      vi.spyOn(fs, 'copyFileSync');
      const projectDir = 'nested/dir/project';

      const tmpDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);
      const targetDir = resolve(__dirname, '..', '..', PROJECTS_DIR, projectDir);
      const tmpMainFile = resolve(tmpDir, 'main.tsp');
      const targetMainFile = resolve(targetDir, 'main.tsp');

      // Create a mock directory with source files
      vol.fromJSON(
        {
          [join(tmpDir, 'main.tsp')]: 'import "@typespec/http";',
        },
        tmpDir
      );

      // Create a mock directory with target files
      vol.fromJSON(
        {
          [join(targetDir, 'main.tsp')]: 'import "@typespec/http";',
        },
        targetDir
      );

      copyMainFileToProjectDir(projectDir);

      expect(copyFileSync).toHaveBeenCalledWith(tmpMainFile, targetMainFile);
    });
  });
});
