import { Project, ts } from 'ts-morph';

import { UriUtils } from '../../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
} from '../../feature/configuration/DocumentSettings';

export class TsMorphProject {
  public project: Project;

  private readonly tsconfigPath: string | undefined;
  private readonly targetSourceDirectory: string;

  constructor(public readonly documentSettings: DocumentSettings) {
    const settings = this.documentSettings.getSettings();
    const targetSourceDirectory = getTargetSourceDirectory(settings);
    this.targetSourceDirectory = targetSourceDirectory;

    let potentialTsConfigPath =
      // eslint-disable-next-line
      settings.pathToTsConfig ||
      (ts.findConfigFile(
        /* searchPath */ UriUtils.toSysPath(targetSourceDirectory),
        ts.sys.fileExists,
        'tsconfig.json'
      ) ??
        '');
    // potentialTsConfigPath = UriUtils.normalize(potentialTsConfigPath);
    potentialTsConfigPath = UriUtils.toSysPath(potentialTsConfigPath);

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
    const normalized = UriUtils.toSysPath(tsConfigPath);
    project.addSourceFilesFromTsConfig(normalized);
  }
  // No tsconfigPath means js project?!
  else if (targetSourceDirectory != null) {
    const pathGlob = `${targetSourceDirectory}/**/*.{j,t}s`;
    project.addSourceFilesAtPaths(pathGlob);
  }

  return project;
}
