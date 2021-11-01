import { DocumentSymbol, Range } from 'vscode-languageserver';
import { Position, SymbolKind } from 'vscode-languageserver-types';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import {
  parseDocumentRegions,
  ViewRegionInfo,
  ViewRegionSubType,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';

const ATTRIBUTE_INTERPOLATION_LENGTH = 10;

export async function onDocumentSymbol(
  container: Container,
  documentUri: string
): Promise<DocumentSymbol[]> {
  const document = TextDocumentUtils.createHtmlFromPath(
    UriUtils.toPath(documentUri)
  );
  const viewModelPath = UriUtils.toPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return [];

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return [];

  const componentList = aureliaProgram.aureliaComponents.getAll();
  const regions = await parseDocumentRegions(document, componentList);

  const finalSymbols: DocumentSymbol[] = [];
  regions.forEach((region) => {
    const symbol = createAureliaDocumentSymbol(region);
    if (!symbol) return;
    finalSymbols.push(symbol);
  });

  return finalSymbols;
}

function createAureliaDocumentSymbol(region: ViewRegionInfo) {
  const converted = convertToSymbolName(region);
  if (!converted) return;

  const symbolName = `Au: ${converted.value}`;
  const start: Position = {
    line: region.startLine! - 1,
    character: region.startCol! - 1,
  };
  const end: Position = {
    line: region.endLine! - 1,
    character: region.endCol! - 1,
  };

  const symbol = DocumentSymbol.create(
    symbolName,
    region.type,
    converted.icon,
    Range.create(start, end),
    Range.create(start, end),
    converted.children ?? []
  );

  return symbol;
}

type SymbolMap = Record<
  ViewRegionType,
  {
    label: string;
    icon: SymbolKind;
    value: string;
    children?: any[];
  }
>;

export function convertToSymbolName(region: ViewRegionInfo) {
  const regionType = region.type;
  if (!regionType) return;
  if (region.subType === ViewRegionSubType.EndTag) return;

  const attributeValue = `${region.attributeName}="${region.attributeValue}"`;
  const symbolMap: SymbolMap = {
    Attribute: { label: 'attr', icon: SymbolKind.Class, value: attributeValue },
    AttributeInterpolation: {
      label: 'attr-inpol',
      icon: SymbolKind.Object,
      value: attributeValue,
    }, //
    BindableAttribute: {
      label: 'bindable',
      icon: SymbolKind.Interface,
      value: attributeValue,
    }, //
    CustomElement: {
      label: 'ce',
      icon: SymbolKind.Boolean,
      value: `<${region.tagName}>` ?? '',
    }, //
    html: {
      label: 'html',
      icon: SymbolKind.Constructor,
      value: attributeValue,
    }, //
    RepeatFor: {
      label: 'repeat',
      icon: SymbolKind.Enum,
      value: `${region.attributeName}="${region.regionValue}"`,
    },
    TextInterpolation: {
      label: 't-inpol',
      icon: SymbolKind.TypeParameter,
      value: `\$\{region.regionValue\}`,
    }, //
    ValueConverter: {
      label: 'vc',
      icon: SymbolKind.Property,
      value: attributeValue,
    }, //
  };

  if (regionType === ViewRegionType.CustomElement) {
    if (region.data?.length) {
      const finalChildrenSymbol: DocumentSymbol[] = [];
      (<ViewRegionInfo[]>region.data)?.forEach((subRegion) => {
        if (subRegion.type !== ViewRegionType.BindableAttribute) return;
        const symbol = createAureliaDocumentSymbol(subRegion);
        if (!symbol) return;
        finalChildrenSymbol.push(symbol);
      });
      symbolMap[regionType].children = finalChildrenSymbol;
    }
  }

  const converted = symbolMap[regionType];
  return converted;
}