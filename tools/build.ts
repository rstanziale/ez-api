import { getCompileCommands, runCommand } from './src/build.ts';
import { getFilenames, getVersion, setDistFiles } from './src/postbuild.ts';

const build = async (): Promise<void> => {
  const projectDir: string = process.argv[2];

  try {
    const commands = getCompileCommands(projectDir);

    commands.forEach(command => {
      console.log(`Running command: ${command}`);
      runCommand(command);
    });

    console.log(`API documentation for ${projectDir} built successfully`);
  } catch (e) {
    console.error(`Failed to build API documentation for project ${projectDir}`);
    console.error(e);
  }
};

const postBuild = (): void => {
  const projectDir: string = process.argv[2];

  try {
    const version = getVersion(projectDir);
    console.log(`Generating API documentation ${version} for project ${projectDir}...`);

    const files = getFilenames(projectDir);
    setDistFiles(projectDir, version, files);

    console.log(`API documentation for ${projectDir} generated successfully`);
  } catch (e) {
    console.error(`Failed to generate API documentation for project ${projectDir}`);
    console.error(e);
  }
};

await build();
postBuild();
