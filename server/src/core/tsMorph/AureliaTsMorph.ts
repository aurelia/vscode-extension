import { Project, ts } from 'ts-morph';
import * as fastGlob from 'fast-glob';

import { UriUtils } from '../../common/view/uri-utils';
import {
  DocumentSettings,
  ExtensionSettings,
} from '../../feature/configuration/DocumentSettings';
import { Logger } from '../../common/logging/logger';

const logger = new Logger('AureliaTsMorph');

export class TsMorphProject {
  public project: Project;

  private readonly tsconfigPath: string | undefined;
  private readonly targetSourceDirectory: string;
  private readonly pathToAureliaFiles: string[] | undefined;

  constructor(public readonly documentSettings: DocumentSettings) {
    const settings = this.documentSettings.getSettings();
    const targetSourceDirectory = getTargetSourceDirectory(settings);
    this.targetSourceDirectory = targetSourceDirectory;
    this.pathToAureliaFiles = settings.aureliaProject?.pathToAureliaFiles;

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
    const project = createTsMorphProject({
      pathToAureliaFiles: this.pathToAureliaFiles,
      targetSourceDirectory: this.targetSourceDirectory,
      tsConfigPath: this.tsconfigPath,
    });

    this.set(project);

    return project;

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
    pathToAureliaFiles?: string[];
  } = {
    customCompilerOptions: {},
    tsConfigPath: undefined,
  }
) {
  const {
    customCompilerOptions,
    tsConfigPath,
    targetSourceDirectory,
    pathToAureliaFiles,
  } = customProjectSettings;

  const project = new Project({
    compilerOptions: customCompilerOptions,
  });

  if (tsConfigPath != null) {
    const normalized = UriUtils.toSysPath(tsConfigPath);
    project.addSourceFilesFromTsConfig(normalized);
  }


  if (pathToAureliaFiles != null) {
    logger.log('`pathToAureliaFiles` to found')
    logger.log(`Including files based on: ${pathToAureliaFiles.join(', ')}`)

    const finalFiles: string[] = [];
    pathToAureliaFiles.forEach((filePath) => {
      const glob = `${filePath}/**/*.js`;
      const matchNodeModules = '**/node_modules/**/*.js';
      const files = fastGlob.sync(glob, {
        cwd: filePath,
        ignore: [matchNodeModules],
      });

      finalFiles.push(...files);
    });

    finalFiles.forEach((file) => {
      // Manually add files, because TSMorph#addSourceFileAtPaths does not provide a exclude for the path globs
      project.addSourceFileAtPath(file);
    });
  }
  // No tsconfigPath means js project?!
  else if (targetSourceDirectory != null) {
    logger.log(`Including files based on: ${targetSourceDirectory}`)

    const glob = `${targetSourceDirectory}/**/*.js`;
    const matchNodeModules = '**/node_modules/**/*.js';
    const files = fastGlob.sync(glob, {
      cwd: targetSourceDirectory,
      ignore: [matchNodeModules],
    });

    files.forEach((file) => {
      // Manually add files, because TSMorph#addSourceFileAtPaths does not provide a exclude for the path globs
      project.addSourceFileAtPath(file);
    });
  }

  return project;
}
