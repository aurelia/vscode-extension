import { Project, ts } from 'ts-morph';

import { UriUtils } from '../../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
} from '../../feature/configuration/DocumentSettings';

export class TsMorphProject {
  public project: Project;

  private readonly tsconfigPath: string = '';

  constructor(public readonly documentSettings: DocumentSettings) {
    const settings = this.documentSettings.getSettings();
    const targetSourceDirectory = getTargetSourceDirectory(settings);

    this.tsconfigPath =
      // eslint-disable-next-line
      settings.pathToTsConfig ||
      (ts.findConfigFile(
        /* searchPath */ UriUtils.toPath(targetSourceDirectory),
        ts.sys.fileExists,
        'tsconfig.json'
      ) ??
        '');
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
  if (settings?.aureliaProject?.rootDirectory !== undefined) {
    targetSourceDirectory = settings.aureliaProject.rootDirectory;
  } else {
    targetSourceDirectory = ts.sys.getCurrentDirectory();
  }

  return targetSourceDirectory;
}

export function createTsMorphProject(
  customProjectSettings: {
    customCompilerOptions?: ts.CompilerOptions;
    tsConfigPath?: string;
  } = {
    customCompilerOptions: {},
    tsConfigPath: undefined,
  }
) {
  const { customCompilerOptions, tsConfigPath } = customProjectSettings;
  const project = new Project({
    compilerOptions: customCompilerOptions,
  });

  if (tsConfigPath !== undefined) {
    project.addSourceFilesFromTsConfig(tsConfigPath);
  }

  return project;
}
