import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { existProjectDir, toCamelCase, toSentence } from '../src/api-new';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('api:new scripts', () => {
  // Mock fs module
  vi.mock('fs', () => ({
    existsSync: vi.fn(),
  }));

  describe.concurrent('existProjectDir', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return true when project directory exists', () => {
      // Arrange
      (existsSync as Mock).mockReturnValue(true);
      const dir = 'test-project';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir);

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(true);
      expect(existsSync).toHaveBeenCalledWith(parameter);
    });

    it('should return false when project directory does not exist', () => {
      // Arrange
      (existsSync as Mock).mockReturnValue(false);
      const dir = 'non-existent';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir);

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(false);
      expect(existsSync).toHaveBeenCalledWith(parameter);
    });

    it('should handle empty string input', () => {
      // Arrange
      (existsSync as Mock).mockReturnValue(false);
      const dir = '';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir);

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(false);
      expect(existsSync).toHaveBeenCalledWith(parameter);
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      (existsSync as Mock).mockReturnValue(true);
      const dir = 'test@project#123';
      const parameter = resolve(__dirname, '..', '..', 'projects', dir);

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(true);
      expect(existsSync).toHaveBeenCalledWith(parameter);
    });
  });

  describe.concurrent('toCamelCase', () => {
    it('should convert hyphenated string to camel case', () => {
      // Arrange
      const input = 'my-project-name';
      const expected = 'MyProjectName';

      // Act
      const result = toCamelCase(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should convert underscore string to camel case', () => {
      // Arrange
      const input = 'my_project_name';
      const expected = 'MyProjectName';

      // Act
      const result = toCamelCase(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle mixed separators', () => {
      // Arrange
      const input = 'my-project_name';
      const expected = 'MyProjectName';

      // Act
      const result = toCamelCase(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle single word', () => {
      // Arrange
      const input = 'project';
      const expected = 'Project';

      // Act
      const result = toCamelCase(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw error for empty string', () => {
      // Arrange
      const input = '';

      // Act & Assert
      expect(() => toCamelCase(input)).toThrow('Input is required');
    });

    it('should handle multiple consecutive separators', () => {
      // Arrange
      const input = 'my--project__name';
      const expected = 'MyProjectName';

      // Act
      const result = toCamelCase(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe.concurrent('toSentence', () => {
    it('should transform simple string', () => {
      // Arrange
      const input = 'hello';
      const expected = 'Hello';

      // Act
      const result = toSentence(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should transform hyphenated string', () => {
      // Arrange
      const input = 'hello-world';
      const expected = 'Hello World';

      // Act
      const result = toSentence(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should transform underscore string', () => {
      // Arrange
      const input = 'hello_world';
      const expected = 'Hello World';

      // Act
      const result = toSentence(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle mixed separators', () => {
      // Arrange
      const input = 'hello-wonderful_world';
      const expected = 'Hello Wonderful World';

      // Act
      const result = toSentence(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should preserve existing capitalization', () => {
      // Arrange
      const input = 'helloWorld-Api';
      const expected = 'HelloWorld Api';

      // Act
      const result = toSentence(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw error for empty string', () => {
      // Arrange
      const input = '';

      // Act & Assert
      expect(() => toSentence(input)).toThrow('Input is required');
    });

    it('should throw error for undefined input', () => {
      // Arrange
      const input = undefined;

      // Act & Assert
      expect(() => toSentence(input)).toThrow('Input is required');
    });
  });
});
