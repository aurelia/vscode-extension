import * as path from 'path';

import {
  CodeAction,
  Command,
  Position,
  Range,
  TextEdit,
  WorkspaceEdit,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { CodeActionMap } from '../../../../common/constants';
import { findSourceWord } from '../../../../common/documens/find-source-word';
import { AnalyzerService } from '../../../../common/services/AnalyzerService';
import { UriUtils } from '../../../../common/view/uri-utils';
import { inject } from '../../../../core/container';
import { getBindablesCompletion } from '../../../../feature/completions/completions';
import { AureliaProgram } from '../../../AureliaProgram';
import { DefinitionResult } from '../../parser-types';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

@inject(AnalyzerService)
export class CustomElementLanguageService
  implements AbstractRegionLanguageService
{
  constructor(private readonly analyzerService?: AnalyzerService) {}

  public async doCodeAction(
    document: TextDocument,
    startPosition: Position,
    region: AbstractRegion
  ): Promise<CodeAction[]> {
    // -- 1. Get tag name
    const targetTagName = region.tagName;

    // -- 2. Find (relative) import path
    const currentPath = path.parse(UriUtils.toSysPath(document.uri)).dir;
    const targetComponent = this.analyzerService?.getOneComponentBy(
      document,
      'componentName',
      targetTagName
    );
    let targetPath = targetComponent?.viewFilePath ?? 'wrong<<';
    // ---- 2.1 TODO Care for html-only component
    // ---- 2.2 Remove ext
    const { dir, name } = path.parse(targetPath);
    targetPath = `${dir}/${name}`;

    let relativePath = path.relative(currentPath, targetPath);
    relativePath = UriUtils.convertToForwardSlash(relativePath);

    // -- 3. Create require tag with import path
    //       <require from=""></require>
    const importTagName = 'require'; // TODO: v2
    const aureliaImportTag = `<${importTagName} from="${relativePath}"></${importTagName}>`;

    // -- 4. Create edits for document
    const editStartPosition = Position.create(2, 0);
    const endPosition = Position.create(2, 0);
    const range = Range.create(editStartPosition, endPosition);
    const editText = `${aureliaImportTag}\n`;
    const importTagEdit = TextEdit.replace(range, editText);

    // -- Create code action
    const kind = CodeActionMap['fix.add.missing.import'].command;
    const edit: WorkspaceEdit = {
      changes: {
        // [document.uri]: [...renameTag.changes[document.uri], hrefEdit],
        [document.uri]: [importTagEdit],
      },
    };
    const command = Command.create('Au: Command <<', kind, [edit]);
    const codeAcion = CodeAction.create(
      CodeActionMap['fix.add.missing.import'].title,
      command,
      kind
    );
    codeAcion.edit = edit;

    return [codeAcion];
  }

  public async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    triggerCharacter: string | undefined,
    region?: AbstractRegion
  ) {
    if (triggerCharacter === ' ') {
      const bindablesCompletion = await getBindablesCompletion(
        aureliaProgram,
        document,
        region
      );
      if (bindablesCompletion.length > 0) return bindablesCompletion;
    }
    return [];
  }

  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    customElementRegion: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    const offset = document.offsetAt(position);
    const goToSourceWord = findSourceWord(customElementRegion, offset);

    const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
      'componentName',
      goToSourceWord
    );
    if (targetComponent == null) return;

    /**
     * 1. Triggered on <|my-component>
     */
    return {
      lineAndCharacter: {
        line: 1,
        character: 1,
      } /** TODO: Find class declaration position. Currently default to top of file */,
      viewModelFilePath: UriUtils.toSysPath(targetComponent.viewModelFilePath),
    };
  }
}
