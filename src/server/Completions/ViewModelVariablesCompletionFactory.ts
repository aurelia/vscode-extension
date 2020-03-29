import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat
} from 'vscode-languageserver';
import { autoinject } from 'aurelia-dependency-injection';
import ElementLibrary from './Library/_elementLibrary';
import BaseAttributeCompletionFactory from './BaseAttributeCompletionFactory';
import { includeCodeAutoComplete } from './AttributeValueCompletionFactory';
import { AureliaApplication } from "../FileParser/Model/AureliaApplication";
import AureliaSettings from '../AureliaSettings';
import { settings } from 'cluster';
import { fileUriToPath } from "../Util/FileUriToPath";
import { normalizePath } from "../Util/NormalizePath";
import { Uri } from 'vscode';

@autoinject()
/**
 * Provide viewModel completion
 *
 * This class would provide `someVar` as a completion item
 *
 * @example
 * class SomeViewModel {
 *   public someVar: string
 * }
 */
export default class ViewModelVariablesCompletionFactory extends BaseAttributeCompletionFactory {
  constructor(
    library: ElementLibrary,
    private readonly application: AureliaApplication,
    private readonly settings: AureliaSettings) { super(library); }

  public create(uri: Uri): CompletionItem[] {
    const result: CompletionItem[] = [];

    if (this.settings.featureToggles.smartAutocomplete) {
      includeCodeAutoComplete(this.application, result, normalizePath(fileUriToPath(uri)));
    }

    return result;
  }
}
