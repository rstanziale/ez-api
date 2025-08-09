import {
  copyMainFileToProjectDir,
  createTmpProjectDir,
  deleteTmpProjectDir,
  importOasFile,
} from './src/api-import';
import {
  createConfigFile,
  createProjectDir,
  createTspFiles,
  existProjectDir,
  updatePackageJson,
} from './src/api-new';

const apiImport = (): void => {
  const projectDir: string = process.argv[2];
  const pathFile: string = process.argv[3];

  try {
    if (!projectDir) {
      throw new Error('No project name specified');
    }

    if (!pathFile) {
      throw new Error('No path to the API file specified');
    }

    if (existProjectDir(projectDir)) {
      throw new Error(`API project ${projectDir} already exists`);
    }

    console.log(`Importing API from ${pathFile} to ${projectDir}...`);

    createTmpProjectDir(projectDir);
    importOasFile(projectDir, pathFile);
    createProjectDir(projectDir);
    createConfigFile(projectDir);
    createTspFiles(projectDir);
    copyMainFileToProjectDir(projectDir);
    updatePackageJson(projectDir);
    deleteTmpProjectDir(projectDir);

    console.log(`Successfully created new API project ${projectDir} from ${pathFile}`);
  } catch (e) {
    console.error(`Failed to create API project ${projectDir}`);
    console.error(e);
  }
};

apiImport();
