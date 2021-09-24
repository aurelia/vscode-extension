import { ts } from 'ts-morph';
import { Logger } from 'culog';
import { AureliaProgram } from './AureliaProgram';
import { IProjectOptions } from '../common/common.types';
import { ExtensionSettings } from '../configuration/DocumentSettings';

const logger = new Logger({ scope: 'watcherProgram' });

export async function createAureliaWatchProgram(
  aureliaProgram: AureliaProgram,
  settings?: ExtensionSettings
  // connection?: ReturnType<typeof createConnection>
): Promise<void> {
  let targetSourceDirectory = '';

  if (settings?.aureliaProject?.rootDirectory) {
    targetSourceDirectory = settings.aureliaProject.rootDirectory;
  } else {
    targetSourceDirectory =
      settings?.aureliaProject?.rootDirectory ?? ts.sys.getCurrentDirectory();
  }

  logger.debug(
    [`The Extension is based on this directly: ${targetSourceDirectory}`],
    { logLevel: 'INFO' }
  );

  let configPath: string | undefined;
  if (settings?.pathToTsConfig) {
    configPath = settings?.pathToTsConfig;

    console.log('[INFO]: A custom path to tsconfig.json was detected:');
    console.log(configPath);
  } else {
    configPath = ts.findConfigFile(
      /* searchPath */ targetSourceDirectory,
      ts.sys.fileExists,
      'tsconfig.json'
    );
    logger.debug(['Path to tsconfig.json detected:'], { logLevel: 'INFO' });
    logger.debug([configPath ?? ''], { logLevel: 'INFO' });
  }

  if (configPath === undefined) {
    logNoTsconfigWarning();
    return;
  }

  // 2. Skip watcher if no tsconfig found
  const isCreateWatchProgram = configPath !== undefined;
  if (isCreateWatchProgram) {
    logger.debug(
      [
        '3.4 Initiating a watcher for documentation and fetching changes in custom components',
      ],
      { logLevel: 'INFO' }
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
      return origCreateProgram(rootNames, options, programHost, oldProgram);
    };
    // 2.2 We also overwrite afterProgramCreate to avoid actually running a compile towards the file system
    host.afterProgramCreate = (builderProgram) => {
      aureliaProgram.setBuilderProgram(builderProgram);
      updateAureliaComponents(aureliaProgram, settings?.aureliaProject);
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

  // 3 .To avoid an extra call to the AureliaComponents mapping we check whether the host has been created
  if (!isCreateWatchProgram) {
    updateAureliaComponents(aureliaProgram);
  }
}

export const updateAureliaComponents = (
  aureliaProgram: AureliaProgram,
  projectOptions?: IProjectOptions
): void => {
  aureliaProgram.setTheProjectsFilePaths(projectOptions);

  aureliaProgram.initComponentList();
  const componentList = aureliaProgram.getComponentList();

  if (componentList.length) {
    aureliaProgram.setComponentList(componentList);
    logger.debug(
      [`>>> The extension found this many components: ${componentList.length}`],
      { logLevel: 'INFO' }
    );

    if (componentList.length < 10) {
      logger.debug(['List: '], { logLevel: 'INFO' });

      componentList.forEach((component, index) => {
        logger.debug([`${index} - ${component.viewModelFilePath}`], {
          logLevel: 'INFO',
        });
      });
    }
  } else {
    console.log('[WARNING]: No components found');
  }
};

function logNoTsconfigWarning() {
  console.log('⚠⚠⚠');
  console.log('[WARNING] No tsconfig.json file found');
  console.log(
    'You can manually specify a path to your tsconfig.json file by adding the following configs to your settings.json:'
  );
  console.log('"aurelia.pathToTsConfig": "<path-to-config>"');
  console.log('⚠⚠⚠');
  console.log(
    '[INFO] Furthermore, you can control, eg. the root directory, or includes/excludes.'
  );
  console.log('Please check out the documentation to find out more');
  console.log('https://github.com/aurelia/vscode-extension#configuration');

  /** TODO: Figure out, if we want to show by default or not
   * Might become spam-y, if you are aware, that extension configured wrongly.
   * ISSUE-VaNcstW0
   */
  // connection?.sendRequest('warning:no-tsconfig-found')
}
