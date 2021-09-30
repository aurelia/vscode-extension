import { Project, ts } from 'ts-morph';

import { DocumentSettings } from '../../configuration/DocumentSettings';

const TEST_FILE_NAME =
  '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/cli-generated/src/realdworld-advanced/settings/index.ts'; // mac
// '/home/hdn/Desktop/note-taking/replit/ts-sandbox/ts-test-class.ts';
const AU_TEST_CLASS =
  '/Users/hdn/Desktop/note-taking/replit/ts-sandbox/virtual-file/aurelia-test-class.ts';

const tsConfigPath =
  '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/tests/testFixture/cli-generated/tsconfig.json';

export class AureliaTsMorph {
  private tsconfigPath = '';

  public constructor(public readonly documentSettings: DocumentSettings) {
    const settings = this.documentSettings.getSettings();
    let targetSourceDirectory = '';

    if (settings?.aureliaProject?.rootDirectory) {
      targetSourceDirectory = settings.aureliaProject.rootDirectory;
    } else {
      targetSourceDirectory =
        settings?.aureliaProject?.rootDirectory ?? ts.sys.getCurrentDirectory();
    }

    this.tsconfigPath =
      settings.pathToTsConfig ??
      ts.findConfigFile(
        /* searchPath */ targetSourceDirectory,
        ts.sys.fileExists,
        'tsconfig.json'
      ) ??
      '';
  }

  create(): void {}

  getTsMorphProject(): Project {
    let compilerSettings = {} as ts.CompilerOptions;
    compilerSettings = {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
      outDir: 'dist',
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      // lib: ['es2017.object', 'es7', 'dom'],
      sourceMap: true,
      rootDir: '.',
    };

    const project = createTsMorphProject({
      customCompilerOptions: {
        ...compilerSettings,
      },
      tsConfigPath: this.tsconfigPath,
    });

    return project;
  }
}

export function createTsMorphProject(
  customProjectSettings: {
    customCompilerOptions?: ts.CompilerOptions;
    tsConfigPath?: string;
  } = {
    customCompilerOptions: {},
    tsConfigPath: '',
  }
) {
  const { customCompilerOptions, tsConfigPath } = customProjectSettings;
  const project = new Project({
    compilerOptions: customCompilerOptions,
  });

  if (tsConfigPath) {
    project.addSourceFilesFromTsConfig(tsConfigPath);
  }

  return project;
}
