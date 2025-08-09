import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, rmSync } from 'fs';
import { fs, vol } from 'memfs';
import { join, resolve } from 'path';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  copyMainFileToProjectDir,
  createTmpProjectDir,
  deleteTmpProjectDir,
  importOasFile,
} from '../src/api-import';
import { PROJECTS_DIR, TMP_DIR } from '../src/const/api-const';

describe.concurrent('api:import scripts', () => {
  // Tell vitest to use fs mock from __mocks__ folder
  // This can be done in a setup file if fs should always be mocked
  vi.mock('node:fs');
  vi.mock('node:fs/promises');
  vi.mock('child_process', () => ({
    execSync: vi.fn(),
  }));

  beforeAll(() => {
    // Reset the state of in-memory fs
    vol.reset();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTmpProjectDir', () => {
    it('should create a temporary project directory', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const projectDir = 'test-project';

      // Act
      createTmpProjectDir(projectDir);

      // Assert
      expect(mkdirSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });

    it('should handle empty projectDir', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const projectDir = '';

      // Act
      createTmpProjectDir(projectDir);

      // Assert
      expect(mkdirSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });

    it('should handle nested projectDir', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const projectDir = 'nested/dir/project';

      // Act
      createTmpProjectDir(projectDir);

      // Assert
      expect(mkdirSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });
  });

  describe('deleteTmpProjectDir', () => {
    it('should delete a temporary project directory', () => {
      // Arrange
      vi.spyOn(fs, 'rmSync');
      const projectDir = 'test-project';

      // Act
      deleteTmpProjectDir(projectDir);

      // Assert
      expect(rmSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });

    it('should handle empty projectDir', () => {
      // Arrange
      vi.spyOn(fs, 'rmSync');
      const projectDir = '';

      // Act
      deleteTmpProjectDir(projectDir);

      // Assert
      expect(rmSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });

    it('should handle nested projectDir', () => {
      // Arrange
      vi.spyOn(fs, 'rmSync');
      const projectDir = 'nested/dir/project';
      mkdirSync(resolve(__dirname, '..', '..', TMP_DIR, projectDir), { recursive: true });

      // Act
      deleteTmpProjectDir(projectDir);

      // Assert
      expect(rmSync).toHaveBeenCalledWith(resolve(__dirname, '..', '..', TMP_DIR, projectDir), {
        recursive: true,
      });
    });
  });

  describe('importOasFile', () => {
    it('should call execSync with correct command', () => {
      // Arrange
      const projectDir = 'test-project';
      const pathFile = 'api.yaml';
      const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);

      // Act
      importOasFile(projectDir, pathFile);

      // Assert
      expect(execSync).toHaveBeenCalledWith(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
    });

    it('should handle empty projectDir', () => {
      // Arrange
      const projectDir = '';
      const pathFile = 'api.yaml';
      const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);

      // Act
      importOasFile(projectDir, pathFile);

      // Assert
      expect(execSync).toHaveBeenCalledWith(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
    });

    it('should handle empty projectDir', () => {
      // Arrange
      const projectDir = '';
      const pathFile = 'api.yaml';
      const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);

      // Act
      importOasFile(projectDir, pathFile);

      // Assert
      expect(execSync).toHaveBeenCalledWith(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
    });

    it('should handle pathFile with spaces', () => {
      // Arrange
      const projectDir = 'proj';
      const pathFile = 'my api.yaml';
      const targetDir = resolve(__dirname, '..', '..', TMP_DIR, projectDir);

      // Act
      importOasFile(projectDir, pathFile);

      // Assert
      expect(execSync).toHaveBeenCalledWith(`tsp-openapi3 ${pathFile} --output-dir ${targetDir}`);
    });
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
