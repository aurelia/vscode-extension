import * as ts from 'typescript';
import { AureliaProgram } from './AureliaProgram';
import { IProjectOptions } from '../common/common.types';
import { documentSettings } from '../configuration/DocumentSettings';

const updateAureliaComponents = (
  aureliaProgram: AureliaProgram,
  projectOptions?: IProjectOptions
): void => {
  aureliaProgram.setProjectFilePaths(projectOptions);

  aureliaProgram.initComponentList();
  const componentList = aureliaProgram.getComponentList();

  if (componentList.length) {
    aureliaProgram.setComponentList(componentList);
    console.log(
      `>>> The extension found this many components: ${componentList.length}`
    );
    if (componentList.length < 10) {
      console.log('List: ');

      componentList.forEach((component, index) => {
        console.log(`${index} - ${component.viewModelFilePath}`);
      });
    }
  } else {
    console.log('[WARNING]: No components found');
  }
};

export async function createAureliaWatchProgram(
  aureliaProgram: AureliaProgram,
  projectOptions?: IProjectOptions
): Promise<void> {
  const settings = await documentSettings.getDocumentSettings();

  let targetSourceDirectory = '';

  if (settings?.aureliaProject?.rootDirectory) {
    targetSourceDirectory = settings.aureliaProject.rootDirectory;
  } else {
    targetSourceDirectory =
      projectOptions?.sourceDirectory ?? ts.sys.getCurrentDirectory();
  }

  console.log(
    '[Info] The Extension is based on this directly: ',
    targetSourceDirectory
  );

  // 1. Define/default path/to/tsconfig.json
  let configPath: string | undefined;
  if (settings?.pathToTsConfig) {
    configPath = settings?.pathToTsConfig;

    console.log('[INFO]: A custom path to tsconfig.json was detected:');
    console.log(configPath);
  } else {
    configPath = ts.findConfigFile(
      // /* searchPath */ "./",
      /* searchPath */ targetSourceDirectory,
      ts.sys.fileExists,
      'tsconfig.json'
    );
    console.log('[INFO]: Path to tsconfig.json detected:');
    console.log(configPath);
  }

  if (configPath === undefined) {
    configPath = '../../tsconfig.json'; // use config file from the extension as default
  }

  // 2. Skip watcher if no tsconfig found
  const isCreateWatchProgram = configPath !== undefined;
  if (isCreateWatchProgram) {
    console.log(
      '[carw.ts] 3.4 Initiating a watcher for documentation and fetching changes in custom components'
    );
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
      configPath,
      {},
      ts.sys,
      createProgram
    );

    // 2.1 We hook into createProgram to enable manual update of AureliaComponents of the application
    // upon changes. We also need to call the original createProgram to fulfill the lifecycle of the host.
    const origCreateProgram = host.createProgram;
    host.createProgram = (
      rootNames: readonly string[] | undefined,
      options,
      programHost,
      oldProgram
    ) => {
      // console.log('-------------- Custom Action ---------------------');
      return origCreateProgram(rootNames, options, programHost, oldProgram);
    };
    // 2.2 We also overwrite afterProgramCreate to avoid actually running a compile towards the file system
    host.afterProgramCreate = (builderProgram) => {
      aureliaProgram.setBuilderProgram(builderProgram);
      updateAureliaComponents(aureliaProgram, projectOptions);
    };

    // 2.3 Create initial watch program with our specially crafted host for aurelia component handling
    ts.createWatchProgram(host);
  } else {
    console.log(
      'Not tsconfig file found. The watcher needs a working tsconfig file'
    );
    console.log(
      'Check out the tsconfig.json for our tests: https://github.com/aurelia/vscode-extension/blob/0cded48f49bebf4564ebc947298cf5033681362d/tests%2Ftsconfig.json'
    );
  }

  /** init call */
  // updateAureliaComponents(aureliaProgram);

  // 3 .To avoid an extra call to the AureliaComponents mapping we check whether the host has been created
  if (!isCreateWatchProgram) {
    updateAureliaComponents(aureliaProgram);
  }
}
