import { execSync } from 'node:child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCompileCommands, runCommand } from '../src/build.ts';

vi.mock('node:child_process');

describe('build scripts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCompileCommands', () => {
    it('should return an array of compile commands', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      expect(commands).toBeInstanceOf(Array);
      expect(commands.length).toBe(2);
    });

    it('should return commands with yaml and json config files', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      expect(commands).toContain(
        'tsp compile projects/test-project/main.tsp --config "./projects/test-project/tspconfig-yaml.yaml"'
      );
      expect(commands).toContain(
        'tsp compile projects/test-project/main.tsp --config "./projects/test-project/tspconfig-json.yaml"'
      );
    });

    it('should include correct project directory in command paths', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      commands.forEach(command => {
        expect(command).toContain('projects/test-project/main.tsp');
        expect(command).toContain('projects/test-project/tspconfig');
      });
    });

    it('should format yaml config command correctly', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      const yamlCommand = commands[0];
      expect(yamlCommand).toMatch(
        /tsp compile projects\/test-project\/main\.tsp --config "\.\/projects\/test-project\/tspconfig-yaml\.yaml"/
      );
    });

    it('should format json config command correctly', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      const jsonCommand = commands[1];
      expect(jsonCommand).toMatch(
        /tsp compile projects\/test-project\/main\.tsp --config "\.\/projects\/test-project\/tspconfig-json\.yaml"/
      );
    });

    it('should handle project directories with special characters', () => {
      // Arrange
      const projectDir = 'my-test-project_123';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      expect(commands.length).toBe(2);
      commands.forEach(command => {
        expect(command).toContain('my-test-project_123');
      });
    });

    it('should return commands in correct order (yaml first, json second)', () => {
      // Arrange
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);

      // Assert
      expect(commands[0]).toContain('yaml');
      expect(commands[1]).toContain('json');
    });
  });

  describe('runCommand', () => {
    it('should execute command using execSync', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const command = 'echo "test"';

      // Act
      runCommand(command);

      // Assert
      expect(mockExecSync).toHaveBeenCalledWith(command);
      expect(mockExecSync).toHaveBeenCalledTimes(1);
    });

    it('should execute tsp compile command', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const command =
        'tsp compile projects/test-project/main.tsp --config "./projects/test-project/tspconfig-yaml.yaml"';

      // Act
      runCommand(command);

      // Assert
      expect(mockExecSync).toHaveBeenCalledWith(command);
    });

    it('should handle commands with quotes and special characters', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const command = 'tsp compile projects/test/main.tsp --config "./config with space.yaml"';

      // Act
      runCommand(command);

      // Assert
      expect(mockExecSync).toHaveBeenCalledWith(command);
    });

    it('should propagate errors from execSync', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const command = 'invalid-command';
      const error = new Error('Command failed');
      mockExecSync.mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => runCommand(command)).toThrow(error);
      expect(mockExecSync).toHaveBeenCalledWith(command);
    });

    it('should not return a value', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      mockExecSync.mockReturnValue(Buffer.from(''));

      const command = 'echo test';

      // Act
      const result = runCommand(command);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    it('should generate and run compile commands for a project', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const projectDir = 'test-project';

      // Act
      const commands = getCompileCommands(projectDir);
      commands.forEach(command => {
        runCommand(command);
      });

      // Assert
      expect(mockExecSync).toHaveBeenCalledTimes(2);
      expect(mockExecSync).toHaveBeenNthCalledWith(
        1,
        'tsp compile projects/test-project/main.tsp --config "./projects/test-project/tspconfig-yaml.yaml"'
      );
      expect(mockExecSync).toHaveBeenNthCalledWith(
        2,
        'tsp compile projects/test-project/main.tsp --config "./projects/test-project/tspconfig-json.yaml"'
      );
    });

    it('should handle multiple projects sequentially', () => {
      // Arrange
      const mockExecSync = vi.mocked(execSync);
      const projects = ['test-project', 'another-project'];

      // Act
      projects.forEach(projectDir => {
        const commands = getCompileCommands(projectDir);
        commands.forEach(command => {
          runCommand(command);
        });
      });

      // Assert
      expect(mockExecSync).toHaveBeenCalledTimes(4);
    });
  });
});
