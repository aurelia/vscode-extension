import * as ts from 'typescript';
import { AureliaProgram } from './AureliaProgram';
import { IProjectOptions } from '../common/common.types';
import { documentSettings } from '../configuration/DocumentSettings';
// import { createConnection } from 'vscode-languageserver';

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
  projectOptions?: IProjectOptions,
  // connection?: ReturnType<typeof createConnection>
): Promise<void> {
  if (projectOptions === undefined) {
    const settings = await documentSettings.getDocumentSettings();
    projectOptions = {
      include: settings?.aureliaProject?.include,
      exclude: settings?.aureliaProject?.exclude,
      rootDirectory: settings?.aureliaProject?.rootDirectory,
    }
  }

  const settings = await documentSettings.getDocumentSettings();

  let targetSourceDirectory = '';

  if (settings?.aureliaProject?.rootDirectory) {
    targetSourceDirectory = settings.aureliaProject.rootDirectory;
  } else {
    targetSourceDirectory =
      projectOptions?.rootDirectory ?? ts.sys.getCurrentDirectory();
  }

  console.log(
    '[Info] The Extension is based on this directly: ',
    targetSourceDirectory
  );

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
    console.log('⚠⚠⚠')
    console.log('[WARNING] No tsconfig.json file found');
    console.log('You can manually specify a path to your tsconfig.json file by adding the following configs to your settings.json:');
    console.log('"aurelia.pathToTsConfig": "<path-to-config>"');
    console.log('⚠⚠⚠')
    console.log('[INFO] Furthermore, you can control, eg. the root directory, or includes/excludes.')
    console.log('Please check out the documentation to find out more')
    console.log('https://github.com/aurelia/vscode-extension#configuration')

    /** TODO: Figure out, if we want to show by default or not
     * Might become spam-y, if you are aware, that extension configured wrongly.
     * ISSUE-VaNcstW0
     */
    // connection?.sendRequest('warning:no-tsconfig-found');
    return;
  //   /** TODO: Offer to create a tsconfig file */
  //   const tsConfigJson = ts.parseConfigFileTextToJson(
  //     'tsconfig.json',
  //     `{
  //       "compilerOptions": {
  //         "target": "es2018",
  //         "module": "commonjs",
  //         "lib": ["es2018"],
  //         "rootDir": ".",
  //         "strict": false,
  //         "esModuleInterop": true
  //       }
  //     }`
  //   );
  //   const sourceText = JSON.stringify(tsConfigJson);
  //   const virtualTsConfigFile = ts.createSourceFile('virtualTsConfig.json', sourceText, 0);
  //   configPath = virtualTsConfigFile.fileName;
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
