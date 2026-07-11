import { exec } from 'node:child_process';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildCommands } from '../runner.ts';
import { runParallel, runSequential } from '../src/runner.ts';

vi.mock('node:child_process');

describe('runner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run commands sequentially', async () => {
    // Arrange
    const mockExec = vi.mocked(exec);
    const command = 'echo sequential';
    mockExec.mockImplementationOnce((_command, _options, callback) => {
      callback?.(null, '', '');
      return {} as ReturnType<typeof exec>;
    });

    // Act
    await runSequential([command]);

    // Assert
    expect(mockExec).toHaveBeenCalledWith(command, expect.anything(), expect.any(Function));
  });

  it('should run commands in parallel', async () => {
    // Arrange
    const mockExec = vi.mocked(exec);
    const commands = ['echo one', 'echo two'];
    mockExec.mockImplementation((_command, _options, callback) => {
      callback?.(null, '', '');
      return {} as ReturnType<typeof exec>;
    });

    // Act
    await runParallel(commands);

    // Assert
    expect(mockExec).toHaveBeenCalledTimes(2);
    expect(mockExec).toHaveBeenNthCalledWith(
      1,
      commands[0],
      expect.anything(),
      expect.any(Function)
    );
    expect(mockExec).toHaveBeenNthCalledWith(
      2,
      commands[1],
      expect.anything(),
      expect.any(Function)
    );
  });

  it('should propagate errors for sequential execution', async () => {
    // Arrange
    const mockExec = vi.mocked(exec);
    const error = { message: 'boom', cmd: 'echo fail' } as Error & { cmd: string };
    mockExec.mockImplementationOnce((_command, _options, callback) => {
      callback?.(error, '', '');
      return {} as ReturnType<typeof exec>;
    });

    // Act / Assert
    await expect(runSequential(['echo fail'])).rejects.toThrow('boom');
  });

  it('should run package.json scripts as npm commands', () => {
    // Arrange
    const projectDir = 'test-project';
    const scripts = new Set([`build:${projectDir}`]);

    // Act
    const commands = buildCommands(`build:${projectDir}`, scripts);

    // Assert
    expect(commands).toEqual(['npm run build:test-project']);
  });

  it('should default to empty list without errors', async () => {
    // Arrange
    const mockExec = vi.mocked(exec);

    // Act
    await expect(runSequential([])).resolves.toBeUndefined();

    // Assert
    expect(mockExec).not.toHaveBeenCalled();
  });
});
