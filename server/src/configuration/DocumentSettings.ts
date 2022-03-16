import 'reflect-metadata';
import { Connection } from 'vscode-languageserver';

import { Logger } from '../common/logging/logger';
import { inject } from '../core/container';

const logger = new Logger('DocumentSettings');

export const settingsName = 'aurelia';

export const AURELIA_ATTRIBUTES_KEYWORDS = [
  'bind',
  'bindable', // html-only custom elements
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
  packageJsonInclude?: string[];
  exclude?: string[];
  rootDirectory?: string;
  /** Difference to `rootDirectory`: root can be monorepo, this one is the specific project */
  projectDirectory?: string;
  /** Absolute paths, that include Aurelia files. Use if the Extension did not pick up expected files. */
  pathToAureliaFiles?: string[];
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
  definitions: boolean;
  renames: boolean;
  documentSymbols: boolean;
  workspaceSymbols: boolean;
}

// The example settings
export class ExtensionSettings {
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

@inject(ExtensionSettings)
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

    let finalExcludes: string[] = [];
    if (exclude === undefined) {
      logger.log('No excludes provided. Defaulting to', { logLevel: 'INFO' });
      const defaultExcludes = [
        '**/node_modules',
        'aurelia_project',
        '**/out',
        '**/build',
        '**/dist',
      ];
      finalExcludes.push(...defaultExcludes);
    } else {
      finalExcludes = exclude;
    }
    logger.log(
      'Exclude files based on globs (from setting: aureliaProject.exclude): ',
      { logLevel: 'INFO' }
    );
    logger.log(`  ${finalExcludes.join(', ')}`, { logLevel: 'INFO' });

    exclude = finalExcludes;

    const include = this.extensionSettings.aureliaProject?.include;
    logger.log(
      'Include files based on globs (from setting: aureliaProject.include): ',
      { logLevel: 'INFO' }
    );
    if (include !== undefined) {
      logger.log(`  ${include.join(', ')}`, { logLevel: 'INFO' });
    } else {
      logger.log('No includes provided.', { logLevel: 'INFO' });
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
