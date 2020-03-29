import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import { GlobalAttributes } from './Library/_elementStructure';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import AureliaSettings from '../AureliaSettings';
import { fileUriToPath } from "../Util/FileUriToPath";
import { normalizePath } from "../Util/NormalizePath";
import { Uri } from 'vscode';
import * as process from 'process';

@autoinject()
export default class AttributeCompletionFactory extends BaseAttributeCompletionFactory {

  public constructor(
    public library: ElementLibrary,
    private readonly application: AureliaApplication,
    private readonly settings: AureliaSettings) {
    super(library);
  }

  public create(elementName: string, attributeName: string, bindingName: string, uri: Uri): CompletionItem[] {

    const result: CompletionItem[] = [];

    if (bindingName === undefined || bindingName === null || bindingName === '') {
      const element = this.getElement(elementName);

      let attribute = element.attributes.get(attributeName);
      if (typeof attribute === 'undefined') {
        attribute = GlobalAttributes.attributes.get(attributeName);
      }

      if (typeof attribute?.values !== 'undefined') {
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

export function includeCodeAutoComplete(application: AureliaApplication, result: CompletionItem[], targetPath: string) {
  const isWin = process.platform === "win32";
  if (!isWin) {
    targetPath = `/${targetPath}`;
  }
  const compoment = application.components.find(component => {
    return component.paths.find(path => path === targetPath);
  });

  if (typeof compoment?.viewModel !== 'undefined') {
    compoment.viewModel.methods.forEach(x => {

      let inner = '';
      for (let i = 0; i < x.parameters.length; i++) {
        inner += `\\$${i + 1},`;
      }
      if (x.parameters.length > 0) {
        inner = inner.substring(0, inner.length - 1);
      }

      result.push({
        documentation: x.name,
        insertText: `${x.name}(${inner})$0`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Method,
        label: x.name,
      });
    });

    compoment.viewModel.properties.forEach(x => {
      let documentation = x.name;
      if (x.type !== '') {
        documentation += ` (${x.type})`;
      }

      result.push({
        documentation: documentation,
        insertText: x.name,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Property,
        label: x.name,
      });
    });
  }
}
