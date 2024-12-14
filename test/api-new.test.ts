import { describe, expect, test } from 'vitest';
import { toCamelCase } from '../tools/api-new';

describe.concurrent('api:new scripts', () => {
  test('Test toCamelCase', () => {
    const result = toCamelCase('test');
    expect(result).not.empty;
  });
});
