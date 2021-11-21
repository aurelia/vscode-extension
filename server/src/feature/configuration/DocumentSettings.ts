import 'reflect-metadata';
import { Logger } from 'culog';
import { Connection } from 'vscode-languageserver';

const logger = new Logger({ scope: 'DocumentSettings' });
// logger.setLogOptions({ logLevel: 'INFO' });
logger.overwriteDefaultLogOtpions({
  // log: false,
  logLevel: 'INFO',
  focusedLogging: false,
  // logScope: false,
});

export const settingsName = 'aurelia';

export const AURELIA_ATTRIBUTES_KEYWORDS = [
  'bind',
  'one-way',
  'two-way',
  'one-time',
  'from-view',
  'to-view',
  'delegate',
  'trigger',
  'call',
  'capture',
  'ref',
] as const;

export interface IAureliaProjectSetting {
  include?: string[];
  exclude?: string[];
  rootDirectory?: string;
  /** Difference to `rootDirectory`: root can be monorepo, this one is the specific project */
  projectDirectory?: string;
}

export const defaultProjectOptions: IAureliaProjectSetting = {
  include: [],
  exclude: [],
  rootDirectory: '',
};

interface Features {}

interface Capabilities {
  completions: boolean;
  codeActions: boolean;
  defintions: boolean;
  renames: boolean;
  documentSymbols: boolean;
  workspaceSymbols: boolean;
}

// The example settings
export interface ExtensionSettings {
  aureliaProject?: IAureliaProjectSetting;
  capabilities?: Capabilities;
  featureToggles?: Features;
  relatedFiles?: {
    script: ['.js', '.ts'];
    style: ['.less', '.sass', '.scss', '.styl', '.css'];
    unit: ['.spec.js', '.spec.ts'];
    view: ['.html'];
  };
  pathToTsConfig?: string;
  /** Whether all found components should be cached (default true) */
  cacheComponents?: boolean;
}

export class DocumentSettings {
  public defaultSettings: ExtensionSettings = {
    relatedFiles: {
      script: ['.js', '.ts'],
      style: ['.less', '.sass', '.scss', '.styl', '.css'],
      unit: ['.spec.js', '.spec.ts'],
      view: ['.html'],
    },
  };
  public globalSettings: ExtensionSettings;

  // Cache the settings of all open documents
  public settingsMap: Map<string, Thenable<ExtensionSettings>> = new Map();

  public connection!: Connection; // !

  public hasConfigurationCapability: boolean = true;

  constructor(private readonly extensionSettings: ExtensionSettings) {
    this.globalSettings = {
      ...this.defaultSettings,
      ...this.extensionSettings,
    };

    let exclude = this.extensionSettings.aureliaProject?.exclude;

    const finalExcludes: string[] = [];

    if (exclude === undefined) {
      const defaultExcludes = [
        '**/node_modules',
        'aurelia_project',
        '**/out',
        '**/build',
        '**/dist',
      ];
      finalExcludes.push(...defaultExcludes);
    }
    logger.debug(['Exclude paths globs: '], { logLevel: 'INFO' });
    logger.debug([finalExcludes.join(', ')], { logLevel: 'INFO' });

    exclude = finalExcludes;

    const include = this.extensionSettings.aureliaProject?.include;
    logger.debug(['Include paths globs: '], { logLevel: 'INFO' });
    if (include !== undefined) {
      logger.debug([include.join(', ')], { logLevel: 'INFO' });
    } else {
      logger.debug(['No includes provided.'], { logLevel: 'INFO' });
    }
  }

  public getSettings(): ExtensionSettings {
    return this.globalSettings;
  }

  public setSettings(extensionSettings: ExtensionSettings) {
    this.globalSettings = {
      ...this.globalSettings,
      aureliaProject: {
        ...this.globalSettings.aureliaProject,
        ...extensionSettings.aureliaProject,
      },
    };
  }

  public inject(
    connection: Connection,
    hasConfigurationCapability: boolean
  ): void {
    this.connection = connection;
    this.hasConfigurationCapability = hasConfigurationCapability;
  }

  /**
   * @param resource - Allow not to provide a resource, will then return global settings
   * @example
   *   ```ts
   *   const settings = await documentSettingsClass.getDocumentSettings(textDocument.uri);
   *   const settings = await documentSettingsClass.getDocumentSettings();
   *   ```
   */
  public async getDocumentSettings(
    resource: string = ''
  ): Promise<ExtensionSettings | undefined> {
    if (!this.hasConfigurationCapability) {
      return Promise.resolve(this.globalSettings);
    }
    let result = this.settingsMap.get(resource);
    if (result === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result = await this.connection.workspace.getConfiguration({
        section: settingsName,
      });
      if (result) {
        this.settingsMap.set(resource, result);
      }
    }
    return result;
  }
}

// export const documentSettings = globalContainer.get(DocumentSettings);
// export const documentSettings = new DocumentSettings({});
