import { kebabCase } from 'lodash';
import { SyntaxKind } from 'typescript';
import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
  TextDocument,
} from 'vscode-languageserver';

import {
  IAureliaClassMember,
  IAureliaComponent,
} from '../../aot/aotTypes';
import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';
import { AureliaClassTypes } from '../../common/constants';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';

export function createCompletionItem(
  classMember: IAureliaClassMember,
  componentName?: string
): CompletionItem {
  const { name, syntaxKind, isBindable, documentation } = classMember;
  const varAsKebabCase = kebabCase(name);
  const quote = '"';
  const kind: CompletionItemKind =
    syntaxKind === SyntaxKind.MethodDeclaration
      ? CompletionItemKind.Method
      : CompletionItemKind.Field;

  const result: CompletionItem = {
    documentation: {
      kind: MarkupKind.Markdown,
      value: documentation,
    },
    detail: `${isBindable ? name : varAsKebabCase}`,
    insertText: isBindable
      ? `${varAsKebabCase}.$\{1:bind}=${quote}$\{0:${name}}${quote}`
      : name,
    insertTextFormat: InsertTextFormat.Snippet,
    kind,
    label:
      '' +
      `(Au ${isBindable ? 'Bindable' : 'Class member'}) ` +
      `${isBindable ? varAsKebabCase : name}`,
    data: {
      elementName: componentName,
    },
  };
  return result;
}

export function createClassCompletionItem(
  aureliaComponent: IAureliaComponent
): CompletionItem {
  const { documentation, componentName, className, viewFilePath } =
    aureliaComponent;
  const finalName = componentName ?? className;
  const result: CompletionItem = {
    documentation: {
      kind: MarkupKind.Markdown,
      value: documentation,
    },
    detail: `${finalName}`,
    insertText: `${finalName}$2>$1</${finalName}>$0`,
    insertTextFormat: InsertTextFormat.Snippet,
    kind: CompletionItemKind.Class,
    label: `(Au Class) ${finalName}`,
    data: { templateImportPath: viewFilePath },
  };
  return result;
}

export function createComponentCompletionList(
  aureliaComponentList: IAureliaComponent[]
): CompletionItem[] {
  const result = aureliaComponentList.map((component) => {
    return createClassCompletionItem(component);
  });

  return result;
}

export async function getBindablesCompletion(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  region?: AbstractRegion
): Promise<CompletionItem[]> {
  if (!region) return [];

  const bindableList = aureliaProgram.aureliaComponents.getBindables();
  const asCompletionItem = bindableList.map((bindable) => {
    const result = createCompletionItem(
      bindable.classMember,
      bindable.componentName
    );
    return result;
  });

  const targetBindables = asCompletionItem.filter((bindable) => {
    // eslint-disable-next-line
    return kebabCase(bindable.data.elementName) === region.tagName;
  });
  return targetBindables;
}

export function createValueConverterCompletion(
  aureliaProgram: AureliaProgram
): CompletionItem[] {
  const valueConverterCompletionList = aureliaProgram.aureliaComponents
    .getAll()
    .filter((component) => component.type === AureliaClassTypes.VALUE_CONVERTER)
    .map((valueConverterComponent) => {
      const elementName = valueConverterComponent.valueConverterName ?? '';
      const result: CompletionItem = {
        documentation: {
          kind: MarkupKind.Markdown,
          value: 'doc todod',
        },
        detail: `${elementName}`,
        insertText: `${elementName}`,
        insertTextFormat: InsertTextFormat.Snippet,
        kind: CompletionItemKind.Class,
        label: `(Au VC) ${valueConverterComponent.className}`,
        data: {
          type: AureliaClassTypes.VALUE_CONVERTER,
          valueConverterName: valueConverterComponent.valueConverterName,
        },
      };
      return result;
    });
  return valueConverterCompletionList;
}
