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
import { checkInsideTag } from '../../common/view/document-parsing';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { AbstractRegionLanguageService } from '../../core/regions/languageServer/AbstractRegionLanguageService';
import { AureliaHtmlLanguageService } from '../../core/regions/languageServer/AureliaHtmlLanguageService';
import { RegionParser } from '../../core/regions/RegionParser';
import { AbstractRegion } from '../../core/regions/ViewRegions';
import {
  createAureliaTemplateAttributeKeywordCompletions,
  createAureliaTemplateAttributeCompletions,
} from './createAureliaTemplateAttributeCompletions';

// const logger = new Logger('on-completions');

export async function onCompletion(
  container: Container,
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument
) {
  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(document.uri);
  if (!targetProject) return [];
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return [];

  // const targetComponent = aureliaProgram.aureliaComponents.getOneByFromDocument(
  // document
  // );
  // const regions = targetComponent?.viewRegions;
  let regions: AbstractRegion[] = [];
  try {
    regions = RegionParser.parse(
      document,
      aureliaProgram.aureliaComponents.getAll()
    );
  } catch (error) {
    /* prettier-ignore */ console.log('TCL: error', error);
    /* prettier-ignore */ console.log('TCL: (error as Error).stack', (error as Error).stack);
  }

  // regions; /*?*/
  RegionParser.pretty(regions, {
    asTable: true,
    maxColWidth: 20,
    ignoreKeys: [
      'sourceCodeLocation',
      'languageService',
      'subType',
      'accessScopes',
      'tagName',
    ],
  }); /* ? */
  // aureliaProgram.aureliaComponents.getAll().map((c) => c.componentName); /*?*/

  // if (regions.length === 0) return [];
  // document.getText(); /* ? */
  const { position } = _textDocumentPosition;
  const offset = document.offsetAt(position);
  const region = ViewRegionUtils.findRegionAtOffset(regions, offset);
  // region; /*?*/

  const text = document.getText();
  const triggerCharacter = text.substring(offset - 1, offset);
  let accumulateCompletions: CompletionItem[] = [];

  if (triggerCharacter === AURELIA_TEMPLATE_ATTRIBUTE_TRIGGER_CHARACTER) {
    const isNotRegion = region === undefined;
    const isInsideTag = await checkInsideTag(document, offset);

    if (isNotRegion && isInsideTag) {
      const atakCompletions =
        createAureliaTemplateAttributeKeywordCompletions();
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
  if (region === undefined) {
    languageService = new AureliaHtmlLanguageService();
  } else {
    languageService = region.languageService;
  }

  const doComplete = languageService.doComplete;
  // const doComplete = mode.doComplete;
  if (doComplete !== undefined) {
    let completions: CompletionItem[] = [CompletionItem.create('')];
    try {
      completions = (await doComplete(
        aureliaProgram,
        document,
        _textDocumentPosition,
        triggerCharacter,
        region
      )) as unknown as CompletionItem[];
    } catch (error) {
      console.log('TCL: error', error);
      /* prettier-ignore */ console.log('TCL: (error as Error).stack', (error as Error).stack);
    }

    accumulateCompletions.push(...completions);
    return accumulateCompletions;
  }

  return [];
}
