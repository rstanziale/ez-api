import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getVersion, setFilenameVersion } from '../src/postbuild';
import { readJSONSync } from 'fs-extra';
import { resolve } from 'path';

describe('postbuild scripts', () => {
  // Mock fs module
  vi.mock('fs-extra', () => ({
    readJSONSync: vi.fn(),
  }));

  describe.concurrent('getVersion', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return version from config.json when present', () => {
      // Arrange
      const mockConfig = { version: '1.2.3' };
      const dir = 'test-project';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir, 'config.json');
      (readJSONSync as Mock).mockReturnValue(mockConfig);

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('1.2.3');
      expect(readJSONSync).toHaveBeenCalledWith(parameter);
    });

    it('should return default version when version is not in config', () => {
      // Arrange
      const mockConfig = { someOtherField: 'value' };
      const dir = 'test-project';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir, 'config.json');
      (readJSONSync as Mock).mockReturnValue(mockConfig);

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('0.0.0');
      expect(readJSONSync).toHaveBeenCalledWith(parameter);
    });

    it('should return default version when config is empty', () => {
      // Arrange
      const dir = 'test-project';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir, 'config.json');
      (readJSONSync as Mock).mockReturnValue({});

      // Act
      const result = getVersion(dir);

      // Assert
      expect(result).toBe('0.0.0');
      expect(readJSONSync).toHaveBeenCalledWith(parameter);
    });

    it('should throw error when config file cannot be read', () => {
      // Arrange
      (readJSONSync as Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act & Assert
      expect(() => getVersion('invalid-project')).toThrow();
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
