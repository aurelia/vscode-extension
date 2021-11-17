import { Project, ts } from 'ts-morph';

import { UriUtils } from '../../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
} from '../../feature/configuration/DocumentSettings';

export class TsMorphProject {
  public project: Project;

  private readonly tsconfigPath: string | undefined;
  private targetSourceDirectory: string;

  constructor(public readonly documentSettings: DocumentSettings) {
    const settings = this.documentSettings.getSettings();
    const targetSourceDirectory = getTargetSourceDirectory(settings);
    this.targetSourceDirectory = targetSourceDirectory;

    const potentialTsConfigPath =
      // eslint-disable-next-line
      settings.pathToTsConfig ||
      (ts.findConfigFile(
        /* searchPath */ UriUtils.toPath(targetSourceDirectory),
        ts.sys.fileExists,
        'tsconfig.json'
      ) ??
        '');

    const sourceDirHasTsConfig = potentialTsConfigPath.includes(
      targetSourceDirectory
    );

    if (sourceDirHasTsConfig) {
      this.tsconfigPath = potentialTsConfigPath;
    }
  }

  public create(): Project {
    // const compilerSettings: ts.CompilerOptions = {
    //   module: ts.ModuleKind.CommonJS,
    //   target: ts.ScriptTarget.ESNext,
    //   // outDir: 'dist',
    //   // emitDecoratorMetadata: true,
    //   // experimentalDecorators: true,
    //   // lib: ['es2017.object', 'es7', 'dom'],
    //   sourceMap: true,
    //   rootDir: '.',
    // };

    const project = createTsMorphProject({
      // customCompilerOptions: {
      //   ...compilerSettings,
      // },
      targetSourceDirectory: this.targetSourceDirectory,
      tsConfigPath: this.tsconfigPath,
    });

    this.set(project);

    return project;
  }

  public get() {
    return this.project;
  }

  public set(tsMorphProject: Project) {
    this.project = tsMorphProject;
  }
}

function getTargetSourceDirectory(settings: ExtensionSettings) {
  let targetSourceDirectory = '';
  if (settings?.aureliaProject?.projectDirectory !== undefined) {
    targetSourceDirectory = settings.aureliaProject.projectDirectory;
  } else {
    targetSourceDirectory = ts.sys.getCurrentDirectory();
  }

  return targetSourceDirectory;
}

export function createTsMorphProject(
  customProjectSettings: {
    customCompilerOptions?: ts.CompilerOptions;
    tsConfigPath?: string;
    targetSourceDirectory?: string;
  } = {
    customCompilerOptions: {},
    tsConfigPath: undefined,
  }
) {
  const { customCompilerOptions, tsConfigPath, targetSourceDirectory } =
    customProjectSettings;

  const project = new Project({
    compilerOptions: customCompilerOptions,
  });

  if (tsConfigPath != null) {
    project.addSourceFilesFromTsConfig(tsConfigPath);
  }
  // No tsconfigPath means js project?!
  else if (targetSourceDirectory) {
    const pathGlob = `${targetSourceDirectory}/**/*.{j,t}s`;
    project.addSourceFilesAtPaths(pathGlob);
  }

  return project;
}
