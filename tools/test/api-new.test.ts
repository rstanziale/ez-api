import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { fs, vol } from 'memfs';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  createConfigFile,
  createMainFile,
  createProjectDir,
  createTspFiles,
  existProjectDir,
  toCamelCase,
  toSentence,
  updatePackageJson,
} from '../src/api-new.ts';
import {
  ARCHETYPE_CONFIG_FILE,
  ARCHETYPE_DIR,
  ARCHETYPE_TSP_CONFIG,
  PROJECTS_DIR,
} from '../src/const/api-const.ts';

describe.concurrent('api:new scripts', () => {
  // Tell vitest to use fs mock from __mocks__ folder
  // This can be done in a setup file if fs should always be mocked
  vi.mock('node:fs');
  vi.mock('node:fs/promises');

  beforeAll(() => {
    // Reset the state of in-memory fs
    vol.reset();

    // Create a mock directory with archetype files
    const sourceDir = resolve(__dirname, '..', ARCHETYPE_DIR);
    vol.fromJSON(
      {
        [join(sourceDir, ARCHETYPE_CONFIG_FILE)]:
          '{"filename":"api-#{PROJECT_NAME}","version":"1.0.0-beta.1"}',
        [join(sourceDir, 'main')]:
          'import "@typespec/http"; import "@typespec/openapi"; import "@typespec/versioning"; using TypeSpec.Http; using TypeSpec.OpenAPI; using TypeSpec.Versioning; @service({ title: "#{PROJECT_NAME} APIs", }) @versioned(Versions) namespace #{PROJECT_NAMESPACE}Namespace; enum Versions { `1.0.0-beta.1`, }',
        [join(sourceDir, ARCHETYPE_TSP_CONFIG)]:
          'emit: - "@typespec/openapi3" options: "@typespec/openapi3": file-type: - json - yaml output-file: api-#{PROJECT_NAME}-x.y.z.{file-type} emitter-output-dir: "{project-root}/../../doc/api-#{PROJECT_NAME}"',
      },
      sourceDir
    );
  });

  describe.concurrent('existProjectDir', () => {
    it('should return true when project directory exists', () => {
      // Arrange
      vi.spyOn(fs, 'existsSync');
      const dir = 'test-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(true);
      expect(existsSync).toHaveBeenCalledWith(sourceDir);
    });

    it('should return false when project directory does not exist', () => {
      // Arrange
      vi.spyOn(fs, 'existsSync');
      const dir = 'non-existent';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(false);
      expect(existsSync).toHaveBeenCalledWith(sourceDir);
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      vi.spyOn(fs, 'existsSync');
      const dir = 'test@project#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      const result = existProjectDir(dir);

      // Assert
      expect(result).toBe(true);
      expect(existsSync).toHaveBeenCalledWith(sourceDir);
    });
  });

  describe.concurrent('createProjectDir', () => {
    it('should create a new project directory', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const dir = 'new-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);

      // Act
      createProjectDir(dir);

      // Assert
      expect(existsSync(sourceDir)).toBe(true);
      expect(mkdirSync).toHaveBeenCalledWith(sourceDir, { recursive: true });
    });

    it('should create nested directories if they do not exist', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const dir = 'nested/project/dir';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);

      // Act
      createProjectDir(dir);

      // Assert
      expect(existsSync(sourceDir)).toBe(true);
      expect(mkdirSync).toHaveBeenCalledWith(sourceDir, { recursive: true });
    });

    it('should not throw an error if the directory already exists', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const dir = 'existing-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act & Assert
      expect(() => createProjectDir(dir)).not.toThrow();
      expect(mkdirSync).toHaveBeenCalledWith(sourceDir, { recursive: true });
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const dir = 'special@project#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);

      // Act
      createProjectDir(dir);

      // Assert
      expect(existsSync(sourceDir)).toBe(true);
      expect(mkdirSync).toHaveBeenCalledWith(sourceDir, { recursive: true });
    });

    it('should handle empty string input', () => {
      // Arrange
      vi.spyOn(fs, 'mkdirSync');
      const dir = '';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);

      // Act
      createProjectDir(dir);

      // Assert
      expect(existsSync(sourceDir)).toBe(true);
      expect(mkdirSync).toHaveBeenCalledWith(sourceDir, { recursive: true });
    });
  });

  describe.concurrent('createConfigFile', () => {
    it('should create a config.json file with the correct content', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'config-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createConfigFile(dir);

      // Assert
      const configFilePath = resolve(sourceDir, ARCHETYPE_CONFIG_FILE);
      expect(existsSync(configFilePath)).toBe(true);
      const configFile = fs.readFileSync(configFilePath, 'utf-8') as string;
      const configFileContent = JSON.parse(configFile);
      expect(configFileContent.filename).toBe(`api-${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(configFilePath, configFile);
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'special@config#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createConfigFile(dir);

      // Assert
      const configFilePath = resolve(sourceDir, ARCHETYPE_CONFIG_FILE);
      expect(existsSync(configFilePath)).toBe(true);
      const configFile = fs.readFileSync(configFilePath, 'utf-8') as string;
      const configFileContent = JSON.parse(configFile);
      expect(configFileContent.filename).toBe(`api-${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(configFilePath, configFile);
    });

    it('should handle empty string input', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = '';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createConfigFile(dir);

      // Assert
      const configFilePath = resolve(sourceDir, ARCHETYPE_CONFIG_FILE);
      expect(existsSync(configFilePath)).toBe(true);
      const configFile = fs.readFileSync(configFilePath, 'utf-8') as string;
      const configFileContent = JSON.parse(configFile);
      expect(configFileContent.filename).toBe(`api-${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(configFilePath, configFile);
    });
  });

  describe.concurrent('createTspFiles', () => {
    it('should create tspconfig files with the correct content', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'tsp-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createTspFiles(dir);

      // Assert
      [`${ARCHETYPE_TSP_CONFIG}.yaml`].forEach(filename => {
        const filePath = resolve(sourceDir, filename);
        expect(existsSync(filePath)).toBe(true);

        const fileContent = fs.readFileSync(filePath, 'utf-8') as string;
        expect(fileContent).toContain(`api-${dir}-x.y.z`);
        expect(writeFileSync).toHaveBeenCalledWith(filePath, fileContent);
      });
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'special@tsp#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createTspFiles(dir);

      // Assert
      [`${ARCHETYPE_TSP_CONFIG}.yaml`].forEach(filename => {
        const filePath = resolve(sourceDir, filename);
        expect(existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, 'utf-8') as string;
        expect(fileContent).toContain(dir);
        expect(writeFileSync).toHaveBeenCalledWith(filePath, fileContent);
      });
    });

    it('should handle empty string input', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = '';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createTspFiles(dir);

      // Assert
      [`${ARCHETYPE_TSP_CONFIG}.yaml`].forEach(filename => {
        const filePath = resolve(sourceDir, filename);
        expect(existsSync(filePath)).toBe(true);

        const fileContent = fs.readFileSync(filePath, 'utf-8') as string;
        expect(fileContent).toContain(dir);
        expect(writeFileSync).toHaveBeenCalledWith(filePath, fileContent);
      });
    });
  });

  describe.concurrent('createMainFile', () => {
    it('should create main.tsp file with the correct content', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'main-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createMainFile(dir);

      // Assert
      const mainFilePath = resolve(sourceDir, 'main.tsp');
      expect(existsSync(mainFilePath)).toBe(true);

      const mainFileContent = fs.readFileSync(mainFilePath, 'utf-8') as string;
      expect(mainFileContent).toContain(toSentence(dir));
      expect(mainFileContent).toContain(toCamelCase(dir));
      expect(writeFileSync).toHaveBeenCalledWith(mainFilePath, mainFileContent);
    });

    it('should handle special characters in directory name', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'special@main#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act
      createMainFile(dir);

      // Assert
      const mainFilePath = resolve(sourceDir, 'main.tsp');
      expect(existsSync(mainFilePath)).toBe(true);

      const mainFileContent = fs.readFileSync(mainFilePath, 'utf-8') as string;
      expect(mainFileContent).toContain(toSentence(dir));
      expect(mainFileContent).toContain(toCamelCase(dir));
      expect(writeFileSync).toHaveBeenCalledWith(mainFilePath, mainFileContent);
    });

    it('should handle empty string input', () => {
      // Arrange
      const dir = '';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      // Act & Assert
      expect(() => createMainFile(dir)).toThrow();
    });
  });

  describe.concurrent('updatePackageJson', () => {
    it('should update package.json with new scripts', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'new-project';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      const packageJsonPath = resolve(__dirname, '..', '..', 'package.json');
      const packageJsonContent = {
        scripts: {
          'build:all': 'compile:existing-project',
        },
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));

      // Act
      updatePackageJson(dir);

      // Assert
      const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8') as string);
      expect(updatedPackageJson.scripts[`compile:${dir}`]).toBe(
        `node --import=tsx tools/build.ts ${dir}`
      );
      expect(updatedPackageJson.scripts[`watch:${dir}`]).toBe(
        `tsp compile projects/${dir}/main.tsp --watch --emit @typespec/openapi3`
      );
      expect(updatedPackageJson.scripts['build:all']).toContain(`compile:${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(
        packageJsonPath,
        JSON.stringify(updatedPackageJson, null, 2)
      );
    });

    it('should handle special characters in project directory name', () => {
      // Arrange
      vi.spyOn(fs, 'writeFileSync');
      const dir = 'special@project#123';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      const packageJsonPath = resolve(__dirname, '..', '..', 'package.json');
      const packageJsonContent = {
        scripts: {
          'build:all': 'compile:existing-project',
        },
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));

      // Act
      updatePackageJson(dir);

      // Assert
      const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8') as string);
      expect(updatedPackageJson.scripts[`compile:${dir}`]).toBe(
        `node --import=tsx tools/build.ts ${dir}`
      );
      expect(updatedPackageJson.scripts[`watch:${dir}`]).toBe(
        `tsp compile projects/${dir}/main.tsp --watch --emit @typespec/openapi3`
      );
      expect(updatedPackageJson.scripts['build:all']).toContain(`compile:${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(
        packageJsonPath,
        JSON.stringify(updatedPackageJson, null, 2)
      );
    });

    it('should handle empty string input', () => {
      // Arrange
      const dir = '';
      const sourceDir = resolve(__dirname, '..', '..', PROJECTS_DIR, dir);
      fs.mkdirSync(sourceDir, { recursive: true });

      const packageJsonPath = resolve(__dirname, '..', '..', 'package.json');
      const packageJsonContent = {
        scripts: {
          'build:all': 'compile:existing-project',
        },
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));

      // Act
      updatePackageJson(dir);

      // Assert
      const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8') as string);
      expect(updatedPackageJson.scripts[`compile:${dir}`]).toBe(
        `node --import=tsx tools/build.ts ${dir}`
      );
      expect(updatedPackageJson.scripts[`watch:${dir}`]).toBe(
        `tsp compile projects/${dir}/main.tsp --watch --emit @typespec/openapi3`
      );
      expect(updatedPackageJson.scripts['build:all']).toContain(`compile:${dir}`);
      expect(writeFileSync).toHaveBeenCalledWith(
        packageJsonPath,
        JSON.stringify(updatedPackageJson, null, 2)
      );
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
      const input = undefined as unknown as string;

      // Act & Assert
      expect(() => toSentence(input)).toThrow('Input is required');
    });
  });
});
