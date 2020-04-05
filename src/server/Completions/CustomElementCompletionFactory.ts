import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat, MarkupKind, createConnection, IConnection
} from 'vscode-languageserver';
import * as ts from 'typescript';
import { autoinject } from 'aurelia-dependency-injection';
import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import ElementLibrary from './Library/_elementLibrary';

const connection: IConnection = createConnection();
const logger = connection.console;

/**
 * Get all the Custom elements from (based on aureliaApplication), and provide completion
 */
@autoinject()
export default class CustomElementCompletionFactory {

  public constructor(private readonly library: ElementLibrary) { }

  public create(parent: string, aureliaApplication: AureliaApplication): CompletionItem[] {
    const result: CompletionItem[] = [];

    // Assumption: Every custom element has a script and a template
    const customElements = aureliaApplication.components.filter(component => component.paths.length >= 2);

    // Map documentation to file paths if found
    const fileClassDocumentation: {[fileName: string]: string} = {};

    const program = aureliaApplication.getProgram();
    if (program !== undefined) {
      const checker = program.getTypeChecker();
      for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
          sourceFile.forEachChild((node) => {
            if (ts.isClassDeclaration(node)) {
              const symbol = checker.getSymbolAtLocation(node.name);
              fileClassDocumentation[sourceFile.fileName] = ts.displayPartsToString(
                symbol.getDocumentationComment(checker));
            }
          });
        }
      }
    } else {
      logger.log("CustomElement: Program missing, can't fetch documentation.");
    }

    customElements.forEach(customElement => {
      let documentation = `\`${customElement.name}\``;

      // Check if there's documentation for the file. If yes use it, otherwise fallback to documentation.
      customElement.paths.forEach((path) => {
        if (path.endsWith('.ts') === true && fileClassDocumentation[path] !== "" && fileClassDocumentation[path] !== undefined) {
            documentation = fileClassDocumentation[path];
        }
      });

      result.push({
        documentation: {
          kind: MarkupKind.Markdown,
          value: documentation,
        },
        detail: `Au Custom Element`,
        insertText: `${customElement.name}$2>$1</${customElement.name}>$0`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Property,
        label: `Au Custom Element: ${customElement.name}`,
      });
    });

    return result;
  }
}
