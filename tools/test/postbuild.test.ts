import { readFileSync, writeFileSync } from 'fs';
import { fs, vol } from 'memfs';
import { join, resolve } from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ARCHETYPE_CONFIG_FILE, PROJECTS_DIR } from '../src/const/api-const';
import { getFilenames, getVersion, setDistFiles, setFilenameVersion } from '../src/postbuild';

describe('postbuild scripts', () => {
  // Tell vitest to use fs mock from __mocks__ folder
  // This can be done in a setup file if fs should always be mocked
  vi.mock('node:fs');
  vi.mock('node:fs/promises');

  beforeEach(() => {
    // Reset the state of in-memory fs
    vol.reset();
  });

  describe.concurrent('getVersion', () => {
    it('should return version from config.json when present', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';

      // Create a mock directory with archetype files
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);
      vol.fromJSON(
        {
          [sourceDir]: `{"filename":"api-${dir}","version":"1.2.3"}`,
        },
        sourceDir
      );

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('1.2.3');
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });

    it('should return default version when version is not in config', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';

      // Create a mock directory with archetype files
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);
      vol.fromJSON(
        {
          [sourceDir]: `{"filename":"api-${dir}"}`,
        },
        sourceDir
      );

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('0.0.0');
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });

    it('should return default version when config is empty', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';

      // Create a mock directory with archetype files
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);
      vol.fromJSON(
        {
          [sourceDir]: `{}`,
        },
        sourceDir
      );

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('0.0.0');
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });

    it('should throw error when config file cannot be read', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'invalid-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);

      // Act & Assert
      expect(() => getVersion(dir)).toThrow();
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });
  });

  describe.concurrent('getFilenames', () => {
    it('should return filenames with default "api" when filename is not in config', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);
      vol.fromJSON(
        {
          [sourceDir]: `{"version":"1.2.3"}`,
        },
        sourceDir
      );

      // Act
      const result = getFilenames(dir);

      // Assert
      expect(result).toEqual(['api-x.y.z.json', 'api-x.y.z.yaml']);
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });

    it('should return filenames with custom filename from config', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);
      vol.fromJSON(
        {
          [sourceDir]: `{"filename":"custom-api","version":"1.2.3"}`,
        },
        sourceDir
      );

      // Act
      const result = getFilenames(dir);

      // Assert
      expect(result).toEqual(['custom-api-x.y.z.json', 'custom-api-x.y.z.yaml']);
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });

    it('should throw error when config file cannot be read', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'invalid-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir, ARCHETYPE_CONFIG_FILE);

      // Act & Assert
      expect(() => getFilenames(dir)).toThrow();
      expect(readFileSync).toHaveBeenCalledWith(sourceDir, 'utf-8');
    });
  });

  describe.concurrent('setDistFiles', () => {
    it('should create dist files with correct version in filenames', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'test-project';
      const version = '1.2.3';
      const files = ['api-x.y.z.json', 'api-x.y.z.yaml'];
      const sourceDir = resolve(__dirname, '..', '..', 'doc', `api-${dir}`);
      const targetDir = resolve(__dirname, '..', '..', 'dist', `api-${dir}`);
      vol.fromJSON(
        {
          [join(sourceDir, 'api-x.y.z.json')]: 'content-json',
          [join(sourceDir, 'api-x.y.z.yaml')]: 'content-yaml',
        },
        sourceDir
      );

      // Act
      setDistFiles(files, dir, version);

      // Assert
      expect(readFileSync).toHaveBeenCalledWith(join(sourceDir, 'api-x.y.z.json'), 'utf-8');
      expect(readFileSync).toHaveBeenCalledWith(join(sourceDir, 'api-x.y.z.yaml'), 'utf-8');
      expect(writeFileSync).toHaveBeenCalledWith(join(targetDir, 'api-1.2.3.json'), 'content-json');
      expect(writeFileSync).toHaveBeenCalledWith(join(targetDir, 'api-1.2.3.yaml'), 'content-yaml');
    });

    it('should throw error when source file cannot be read', () => {
      // Arrange
      vi.spyOn(fs, 'readFileSync');
      const dir = 'test-project';
      const version = '1.2.3';
      const files = ['invalid-file.json'];
      const sourceDir = resolve(__dirname, '..', '..', 'doc', `api-${dir}`);

      // Act & Assert
      expect(() => setDistFiles(files, dir, version)).toThrow();
      expect(readFileSync).toHaveBeenCalledWith(join(sourceDir, 'invalid-file.json'), 'utf-8');
    });
  });

  describe.concurrent('setFilenameVersion', () => {
    it('should replace x.y.z pattern with provided version', () => {
      // Arrange
      const filename = 'api-x.y.z.json';
      const version = '1.2.3';

      // Act
      const result = setFilenameVersion(filename, version);

      // Assert
      expect(result).toBe('api-1.2.3.json');
    });

    it('should handle semantic version formats', () => {
      // Arrange
      const filename = 'api-x.y.z.yaml';
      const version = '2.0.0-beta';

      // Act
      const result = setFilenameVersion(filename, version);

      // Assert
      expect(result).toBe('api-2.0.0-beta.yaml');
    });

    it('should return original string if pattern not found', () => {
      // Arrange
      const filename = 'api-1.2.3.json';
      const version = '3.4.5';

      // Act
      const result = setFilenameVersion(filename, version);

      // Assert
      expect(result).toBe('api-1.2.3.json');
    });

    it('should handle empty version string', () => {
      // Arrange
      const filename = 'api-x.y.z.json';
      const version = '';

      // Act
      const result = setFilenameVersion(filename, version);

      // Assert
      expect(result).toBe('api-.json');
    });

    it('should handle undefined version string', () => {
      // Arrange
      const filename = 'api-x.y.z.json';

      // Act
      const result = setFilenameVersion(filename);

      // Assert
      expect(result).toBe('api-0.0.0.json');
    });

    it('should handle version with special characters', () => {
      // Arrange
      const filename = 'api-x.y.z.yaml';
      const version = '1.0.0-alpha.1';

      // Act
      const result = setFilenameVersion(filename, version);

      // Assert
      expect(result).toBe('api-1.0.0-alpha.1.yaml');
    });

    it('should throw error when filename is empty', () => {
      // Arrange
      const filename = '';

      // Act & Assert
      expect(() => {
        setFilenameVersion(filename);
      }).toThrow('Filename is required');
    });
  });
});
