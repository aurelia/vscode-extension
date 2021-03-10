import 'reflect-metadata';
import { Connection } from 'vscode-languageserver';
import { Container, singleton } from 'aurelia-dependency-injection';
const globalContainer = new Container();

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
];

interface IAureliaProject {
  include?: string[];
  exclude?: string[];
}

interface Features {}

// The example settings
export interface ExtensionSettings {
  aureliaProject?: IAureliaProject;
  featureToggles?: Features;
  relatedFiles?: {
    script: ['.js', '.ts'];
    style: ['.less', '.sass', '.scss', '.styl', '.css'];
    unit: ['.spec.js', '.spec.ts'];
    view: ['.html'];
  };
  pathToTsConfig?: string;
}

@singleton()
export class DocumentSettings {
  // The global settings, used when the `workspace/configuration` request is not supported by the client.
  // Please note that this is not the case when using this server with the client provided in this example
  // but could happen with other clients.
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

  public hasConfigurationCapability: boolean = false;

  constructor() {
    this.globalSettings = this.defaultSettings;
  }

  public inject(connection: Connection, hasConfigurationCapability: boolean): void {
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
    if (!result) {
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

export const documentSettings = globalContainer.get(DocumentSettings);
