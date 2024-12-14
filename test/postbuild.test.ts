import { describe, expect, test } from 'vitest';
import { setFilenameVersion } from '../tools/postbuild';

describe.concurrent('postbuild scripts', () => {
  test('Test setFilenameVersion', () => {
    const result = setFilenameVersion('test', '1.2.3');
    expect(result).not.empty;
  });
});
