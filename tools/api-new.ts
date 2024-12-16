import {
  existProjectDir,
  createProjectDir,
  createConfigFile,
  createTspFiles,
  createMainFile,
  updatePackageJson,
} from './src/api-new';

const apiNew = (): void => {
  const projectDir: string = process.argv[2];

  try {
    if (!projectDir) {
      throw new Error('No project name specified');
    }

    if (existProjectDir(projectDir)) {
      throw new Error(`API project ${projectDir} already exists`);
    }

    console.log(`Creating new API project ${projectDir}...`);

    createProjectDir(projectDir);
    createConfigFile(projectDir);
    createTspFiles(projectDir);
    createMainFile(projectDir);
    updatePackageJson(projectDir);

    console.log(`Successfully created new API project ${projectDir}`);
  } catch (e) {
    console.error(`Failed to create API project ${projectDir}`);
    console.error(e);
  }
};

apiNew();
