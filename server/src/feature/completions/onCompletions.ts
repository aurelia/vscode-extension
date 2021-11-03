import {
  TextDocumentPositionParams,
  CompletionItem,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER,
  AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER,
} from '../../common/constants';
import { ViewRegionUtils } from '../../common/documens/ViewRegionUtils';
import { Logger } from '../../common/logging/logger';
import { checkInsideTag } from '../../common/view/document-parsing';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { LanguageModes } from '../../core/embeddedLanguages/languageModes';
import { AbstractRegionLanguageService } from '../../core/regions/languageServer/AbstractRegionLanguageService';
import { AureliaHtmlLanguageService } from '../../core/regions/languageServer/AureliaHtmlLanguageService';
import { RegionParser } from '../../core/regions/RegionParser';
import {
  createAureliaTemplateAttributeKeywordCompletions,
  createAureliaTemplateAttributeCompletions,
} from './createAureliaTemplateAttributeCompletions';

const logger = new Logger('on-completions');

export async function onCompletion(
  container: Container,
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  languageModes: LanguageModes
) {
  // const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
  //   document,
  //   _textDocumentPosition.position
  // );

  // if (!modeAndRegion) return [];
  // const { mode } = modeAndRegion;

  // if (!mode) return [];
  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(document.uri);
  if (!targetProject) return [];
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return [];

  const targetComponent = aureliaProgram.aureliaComponents.getOneByFromDocument(
    document
  );
  // const regions = targetComponent?.viewRegions;
  const regions = RegionParser.parse(
    document,
    aureliaProgram.aureliaComponents.getAll()
  );
  regions; /*?*/
  // aureliaProgram.aureliaComponents.getAll().map((c) => c.componentName); /*?*/

  // if (regions.length === 0) return [];
  document.getText(); /*?*/
  const { position } = _textDocumentPosition;
  const offset = document.offsetAt(position);
  offset; /*?*/
  let region = ViewRegionUtils.findRegionAtOffset(regions, offset);
  region; /*?*/

  const text = document.getText();
  text; /*?*/
  const triggerCharacter = text.substring(offset - 1, offset);
  triggerCharacter; /*?*/
  let accumulateCompletions: CompletionItem[] = [];

  if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER) {
    const isNotRegion = region === undefined;
    const isInsideTag = await checkInsideTag(document, offset);

    if (isNotRegion && isInsideTag) {
      const atakCompletions = createAureliaTemplateAttributeKeywordCompletions();
      return atakCompletions;
    }
  } else if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_CHARACTER) {
    let ataCompletions: CompletionItem[];
    const isNotRegion = region === undefined;
    const isInsideTag = await checkInsideTag(document, offset);

    if (isInsideTag) {
      ataCompletions = createAureliaTemplateAttributeCompletions();

      if (isNotRegion) {
        return ataCompletions;
      }

      accumulateCompletions = ataCompletions;
    }
  }

  let languageService: AbstractRegionLanguageService;
  if (!region) {
    languageService = new AureliaHtmlLanguageService();
  } else {
    languageService = region.languageService;
  }

  const doComplete = languageService.doComplete;
  // const doComplete = mode.doComplete;
  if (doComplete !== undefined) {
    let completions: CompletionItem[] = [CompletionItem.create('')];
    try {
      completions = ((await doComplete(
        aureliaProgram,
        document,
        _textDocumentPosition,
        triggerCharacter,
        region
      )) as unknown) as CompletionItem[];
    } catch (error) {
      console.log('TCL: error', error);
    }

    accumulateCompletions.push(...completions);
    return accumulateCompletions;
  }

  return [];
}
