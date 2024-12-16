import { getFilenames, getVersion, setDistFiles } from './src/postbuild';

const postBuild = (): void => {
  const projectDir: string = process.argv[2];

  try {
    const version = getVersion(projectDir);
    console.log(`Generating API documentation ${version} for project ${projectDir}...`);

    const files = getFilenames(projectDir);
    setDistFiles(files, projectDir, version);

    console.log(`API documentation for ${projectDir} generated successfully`);
  } catch (e) {
    console.error(`Failed to generate API documentation for project ${projectDir}`);
    console.error(e);
  }
};

postBuild();
