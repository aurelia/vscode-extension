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
        // Fetch name of source file and see if it matches the custom component
        if (!sourceFile.isDeclarationFile && this.getElementNameFromSourceFile(sourceFile) === elementName) {
          sourceFile.forEachChild((node) => {
            // Check whether it's a class declaration and that the class name matches the custom component
            if (ts.isClassDeclaration(node) && this.getElementNameFromClassDeclaration(node) === elementName) {
              node.members.forEach(member => {
                if (ts.isPropertyDeclaration(member) && this.propertyIsBindable(member)) {
                  const propertyName = member.name?.getText();

                  // Get bindable type. If bindable type is undefined, we set it to be "unknown".
                  const bindableType = member.type?.getText() !== undefined ? member.type?.getText() : "unknown";
                  const bindableTypeText = `Bindable type: \`${bindableType}\``;

                  // Add comment documentation if available
                  const symbol = checker.getSymbolAtLocation(member.name);
                  const commentDoc = ts.displayPartsToString(
                    symbol.getDocumentationComment(checker)
                  );

                  // Add default values. The value can be undefined, but that is correct in most cases.
                  const defaultValue = member.initializer?.getText();
                  const defaultValueText = `Default value: \`${defaultValue}\``;

                  // Concatenate documentation parts with spacing
                  const documentation = `${commentDoc}\n\n${bindableTypeText}\n\n${defaultValueText}`;

                  const quote = this.settings.quote;
                  const varAsKebabCase = this.stringAsKebabCase(propertyName);
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

  /**
   * Fetches the equivalent component name based on the given ts.SourceFile
   *
   * @param sourceFile - The source file to map a component name from
   */
  private getElementNameFromSourceFile(sourceFile: ts.SourceFile): string {
    // Get basename and strip valid extensions
    const pathName = Path.basename(sourceFile.fileName)
      .replace(/\.(ts|js|html)$/, '');

    return this.stringAsKebabCase(pathName);
  }

  /**
   * Fetches the equivalent component name based on the given class declaration
   *
   * @param sourceFile - The class declaration to map a component name from
   */
  private getElementNameFromClassDeclaration(classDeclaration: ts.ClassDeclaration): string {
    return this.stringAsKebabCase(classDeclaration.name?.getText());
  }

  /**
   * stringAsKebabCase converts a string to kebab case. This is useful when trying to get element name from strings.
   *
   * Ex: HelloWorld => hello-world
   *
   * @param candidate - The string to be converted to kebab case
   */
  private stringAsKebabCase(candidate: string): string {
    return candidate
      .split(/(?=[A-Z])/)
      .map(s => s.toLowerCase())
      .join('-');
  }
}
