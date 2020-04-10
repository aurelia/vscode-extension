import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  IConnection,
  createConnection,
  MarkupKind
} from 'vscode-languageserver';
import * as ts from 'typescript';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import AureliaSettings from '../AureliaSettings';
import { fileUriToPath } from "../Util/FileUriToPath";
import { normalizePath } from "../Util/NormalizePath";
import { Uri } from 'vscode';
import * as Path from 'path';

const connection: IConnection = createConnection();
const logger = connection.console;

@autoinject()
export default class AttributeCompletionFactory extends BaseAttributeCompletionFactory {

  public constructor(
    library: ElementLibrary,
    private readonly application: AureliaApplication,
    private readonly settings: AureliaSettings) { super(library); }

  public create(elementName: string, attributeName: string, bindingName: string, uri: Uri): CompletionItem[] {

    const result: CompletionItem[] = [];

    if (bindingName === undefined || bindingName === null || bindingName === '') {
      const element = this.getElement(elementName);

      let attribute = element.attributes.get(attributeName);
      if (attribute === undefined) {
        attribute = GlobalAttributes.attributes.get(attributeName);
      }

      if (attribute?.values !== undefined) {
        for (const [key, value] of attribute.values.entries()) {
          result.push({
            documentation: value.documentation,
            insertText: key,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Property,
            label: key,
          });
        }
      }
    }

    if (this.settings.featureToggles.smartAutocomplete) {
      includeCodeAutoComplete(this.application, result, normalizePath(fileUriToPath(uri)));
    }

    return result;
  }
}

interface IParameterInformation {
  name: string;
  type: string;
  documentation: string;
}

export function includeCodeAutoComplete(application: AureliaApplication, result: CompletionItem[], targetPath: string) {
  // eslint-disable-next-line no-undef
  const isWin = process.platform === "win32";
  if (!isWin) {
    targetPath = `/${targetPath}`;
  }

  const program = application.getProgram();

  if (program !== undefined) {
    const checker = program.getTypeChecker();
    // Allow for both js and ts to match
    const noExtPath = targetPath.replace(".html", "");
    const tsPath = `${noExtPath}.ts`;
    const jsPath = `${noExtPath}.js`;
    for (const sourceFile of program.getSourceFiles()) {
      // Fetch name of source file and see if it matches the custom component. This has a fundemental flaw that
      // we can't really get the class and check for `@useView` for uncoupled web components (different names of
      // sourcefile and template file). This should be looked into as further improvement.
      const hasMatchingPath = sourceFile.fileName === jsPath || sourceFile.fileName === tsPath;

      if (!sourceFile.isDeclarationFile) {
        sourceFile.forEachChild(node => {
          if (ts.isClassDeclaration(node) && isNodeExported(node) && (hasMatchingPath || classDeclarationHasUseViewMatch(node, targetPath))) {
            const className = node.name?.getText() === '' ? `Default export ${Path.basename(node.getSourceFile().fileName)}` : node.name?.getText();

            node.members.forEach(member => {
              // Check if the member is private
              if (isPrivate(member)) {
                return;
              }

              // Handle property
              if (ts.isPropertyDeclaration(member)) {
                const propertyName = member.name?.getText();

                // Get property type. If property type is undefined, we set it to be "unknown".
                const propertyType = member.type?.getText() !== undefined ? member.type?.getText() : "unknown";
                const propertyTypeText = `Property type: \`${propertyType}\``;

                // Add comment documentation if available
                const symbol = checker.getSymbolAtLocation(member.name);
                const commentDoc = ts.displayPartsToString(
                  symbol.getDocumentationComment(checker)
                );

                // Add default values. The value can be undefined, but that is correct in most cases.
                const defaultValue = member.initializer?.getText();
                const defaultValueText = `Default value: \`${defaultValue}\``;

                // Concatenate documentation parts with spacing
                const documentation = `${commentDoc}\n\n${propertyTypeText}\n\n${defaultValueText}`;

                result.push({
                  detail: `Property (${className})`,
                  documentation: {
                    kind: MarkupKind.Markdown,
                    value: documentation
                  },
                  insertText: propertyName,
                  insertTextFormat: InsertTextFormat.Snippet,
                  kind: CompletionItemKind.Property,
                  label: propertyName,
                });
              }

              // Handle method
              if (ts.isMethodDeclaration(member)) {
                const methodName = member.name?.getText();

                // Get method return type. If the return type is undefined, we set it to be "unknown".
                const methodReturnType = member.type?.getText() !== undefined ? member.type?.getText() : "unknown";
                const methodReturnTypeText = `Method return type: \`${methodReturnType}\``;

                const parameterList: IParameterInformation[] = [];
                if (member.parameters?.length > 0) {
                  member.parameters.forEach(parameter => {
                    const parameterName = parameter.name.getText();
                    const parameterType = parameter.type?.getText() !== undefined ? parameter.type?.getText() : "unknown";
                    const symbol = checker.getSymbolAtLocation(parameter.name);
                    const parameterDoc = ts.displayPartsToString(
                      symbol.getDocumentationComment(checker)
                    );

                    parameterList.push({
                      name: parameterName,
                      type: parameterType,
                      documentation: parameterDoc,
                    });

                  });
                }

                const parameterDoc = parameterList.map(parameter => {
                  let paramDoc = `_@param_ \`${parameter.name}\`: ${parameter.type}`;

                  if(parameter.documentation !== "") {
                    paramDoc = `${paramDoc} — ${parameter.documentation}`;
                  }
                  return paramDoc;
                }).join("\n\n");

                const parameterListString = parameterList.map(parameter => {
                  return `${parameter.name}`;
                }).join(", ");

                // Add comment documentation if available
                const symbol = checker.getSymbolAtLocation(member.name);
                const methodDoc = ts.displayPartsToString(
                  symbol.getDocumentationComment(checker)
                );

                // Concatenate documentation parts with spacing
                const documentation = `${methodDoc}\n\n${parameterDoc}\n\n${methodReturnTypeText}\n\n`;

                result.push({
                  detail: `Method (${className})`,
                  documentation: {
                    kind: MarkupKind.Markdown,
                    value: documentation
                  },
                  insertText: `${methodName}(${parameterListString})`,
                  insertTextFormat: InsertTextFormat.Snippet,
                  kind: CompletionItemKind.Method,
                  label: methodName,
                });
              }
            });
          }
        });
      }
    }
  } else {
    logger.log("AttributeValue: Program missing, can't fetch CompletionItems.");
  }
}

function isNodeExported(node: ts.Declaration): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

function isPrivate(node: ts.Declaration): boolean {
  return node.modifiers?.some(modifier => {
    return modifier.getText() === "private";
  });
}

/**
 * classDeclarationHasUseViewMatch checks whether a classDeclaration has a useView that matches
 * the file in question. Returns true or false depending on result.
 *
 * @param classDeclaration - ClassDeclaration to check
 * @param path - Path to check is in useView
 */
function classDeclarationHasUseViewMatch(classDeclaration: ts.ClassDeclaration, path: string): boolean {
  const useViewDecorator = classDeclaration.decorators?.find(decorator => {
    return decorator.getText().includes("@useView");
  });

  /**
   * We only want to handle absolute paths (as we get two paths during lookup)
   */
  if (!Path.isAbsolute(path)) {
    return;
  }

  if (useViewDecorator === undefined) {
    return false;
  }

  const viewFileName = Path.basename(path);
  return useViewDecorator.getText().includes(viewFileName);
}
