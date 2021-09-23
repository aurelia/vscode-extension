import { diagnosticMessagesData } from './diagnosticMessagesData';

export class DiagnosticMessages {
  private readonly aureliaCode = 'auvsc';

  private readonly diagnosticCodeForMessage: string;

  constructor(private readonly message: keyof typeof diagnosticMessagesData) {
    this.message = message;
    this.diagnosticCodeForMessage = `${this.aureliaCode}(${diagnosticMessagesData[message].code})`;
  }

  public log(): void {
    const targetMessage = diagnosticMessagesData[this.message];
    const consoleMessage = `[${targetMessage.category}] ${this.message} ${this.diagnosticCodeForMessage}`;

    // console.log(consoleMessage);
  }

  public additionalLog(message: string, data: any): void {
    // console.log(`${message}: ${data} ${this.diagnosticCodeForMessage}`);
  }
}
