export namespace AureliaSettingsNS {
  export interface IFeatureToggles {
    smartAutocomplete: boolean,
  }

  export interface IExtensionSettings {
    pathToAureliaProject: string[]
  }
}

export default class AureliaSettings {
  public quote: string = '"';
  public validation: boolean = true;
  public bindings = {
    data: []
  }

  public featureToggles: AureliaSettingsNS.IFeatureToggles = {
    smartAutocomplete: true,

  }

  public extensionSettings: AureliaSettingsNS.IExtensionSettings = {
    pathToAureliaProject: ['src']
  }
}
