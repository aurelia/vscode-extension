export class ExtensionSettings {
  flag: string;
}

// @inject(Settings)
export class DocumentSettings {
  constructor(public settings: ExtensionSettings) {}
  public AAAABBBCC: string;
}
