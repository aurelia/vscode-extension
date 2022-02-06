import { Logger } from '../logging/logger';
import { diagnosticMessagesData } from './diagnosticMessagesData';

const logger = new Logger('Diagnostics');

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

    // logger.log(consoleMessage);

  }

  public additionalLog(message: string, data: unknown): void {

    // logger.log(`${message}: ${data} ${this.diagnosticCodeForMessage}`);
  }
}
