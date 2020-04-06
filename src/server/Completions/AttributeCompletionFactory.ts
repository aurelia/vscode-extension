import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
  IConnection,
  createConnection,
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import AureliaSettings from "../AureliaSettings";
import * as ts from 'typescript';
import * as Path from 'path';

const connection: IConnection = createConnection();
const logger = connection.console;

@autoinject()
export default class AureliaAttributeCompletionFactory extends BaseAttributeCompletionFactory {

  public constructor(library: ElementLibrary, private readonly settings: AureliaSettings) { super(library); }

  public create(elementName: string, existingAttributes: string[], aureliaApplication: AureliaApplication): CompletionItem[] {

    const result: CompletionItem[] = [];
    const element = this.getElement(elementName);

    this.addViewModelBindables(result, elementName, aureliaApplication);

    if (element.hasGlobalAttributes) {
      this.addAttributes(GlobalAttributes.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.attributes !== undefined) {
      this.addAttributes(element.attributes, result, existingAttributes, this.settings.quote);
    }

    if (element.hasGlobalEvents) {
      this.addEvents(GlobalAttributes.events, result, existingAttributes, this.settings.quote);
    }

    if (element.events !== undefined) {
      this.addEvents(element.events, result, existingAttributes, this.settings.quote);
    }

    return result;
  }

  /**
   * Look at the View Model and provide all class variables as completion in kebab case.
   */
  private addViewModelBindables(result: CompletionItem[], elementName: string, aureliaApplication: AureliaApplication) {
    const program = aureliaApplication.getProgram();
    if (program !== undefined) {
      const checker = program.getTypeChecker();
      for (const sourceFile of program.getSourceFiles()) {
        const elementNameCandidate = Path.basename(sourceFile.fileName).replace(/\.(ts|js|html)$/, '').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
        if (!sourceFile.isDeclarationFile && elementNameCandidate === elementName) {
          sourceFile.forEachChild((node) => {
            if (ts.isClassDeclaration(node) && node.name.getText().split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-') === elementName) {
              node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && this.propertyIsBindable(member)) {
                  const propertyName = member.name?.getText();
                  const bindableType = `Bindable type: \`${member.type?.getText() !== undefined ? member.type?.getText() : "unknown" }\``;

                  // Add comment documentation if available
                  const symbol = checker.getSymbolAtLocation(member.name);
                  const commentDoc = ts.displayPartsToString(
                    symbol.getDocumentationComment(checker)
                  );

                  // Add default values
                  const defaultValue = `Default value: \`${member.initializer?.getText()}\``;

                  // Concatenate documentation parts with spacing
                  const documentation = `${commentDoc}\n\n${bindableType}\n\n${defaultValue}`;

                  const quote = this.settings.quote;
                  const varAsKebabCase = propertyName.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
                  result.push({
                    documentation: {
                      kind: MarkupKind.Markdown,
                      value: documentation
                    },
                    detail: `${varAsKebabCase}`,
                    insertText: `${varAsKebabCase}.$\{1:bind}=${quote}$\{0:${propertyName}}${quote}`,
                    insertTextFormat: InsertTextFormat.Snippet,
                    kind: CompletionItemKind.Variable,
                    label: `${varAsKebabCase} (Au Bindable)`
                  });
                }
              });
            }
          });
        }
      }
    } else {
      logger.log("AttributeCompletion bindables: Program missing, can't fetch CompletionItems.");
    }
  }

  /**
   * propertyIsBindable checks whether a PropertyDeclaration is bindable
   *
   * @param propertyDeclaration - PropertyDeclaration to check if is bindable
   */
  private propertyIsBindable(propertyDeclaration: ts.PropertyDeclaration): boolean {
    return propertyDeclaration.decorators?.some(decorator => { return decorator.getText().includes("@bindable"); });
  }
}
