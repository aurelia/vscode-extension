import { DocumentSymbol, Range } from 'vscode-languageserver';
import { Position, SymbolKind } from 'vscode-languageserver-types';

import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';
import { RegionParser } from '../../core/regions/RegionParser';
import {
  AbstractRegion,
  CustomElementRegion,
  ViewRegionSubType,
  ViewRegionType,
} from '../../core/regions/ViewRegions';

export async function onDocumentSymbol(
  container: Container,
  documentUri: string
): Promise<DocumentSymbol[]> {
  const document = TextDocumentUtils.createHtmlFromPath(
    UriUtils.toSysPath(documentUri)
  );
  const viewModelPath = UriUtils.toSysPath(document.uri);
  const targetProject = container
    .get(AureliaProjects)
    .getFromPath(viewModelPath);
  if (!targetProject) return [];

  const { aureliaProgram } = targetProject;
  if (!aureliaProgram) return [];

  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);
  const regions = targetComponent?.viewRegions ?? [];

  const finalSymbols: DocumentSymbol[] = [];
  regions.forEach((region) => {
    const symbol = createAureliaDocumentSymbol(region);
    if (!symbol) return;
    finalSymbols.push(symbol);
  });

  return finalSymbols;
}

function createAureliaDocumentSymbol(region: AbstractRegion) {
  const converted = convertToSymbolName(region);
  if (!converted) return;

  const symbolName = `Au: ${converted.value}`;
  const start: Position = {
    line: region.sourceCodeLocation.startLine,
    character: region.sourceCodeLocation.startCol,
  };
  const end: Position = {
    line: region.sourceCodeLocation.endLine,
    character: region.sourceCodeLocation.endCol,
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

type RegionSymbol = {
  label: string;
  icon: SymbolKind;
  value: string;
  children?: DocumentSymbol[];
};

type SymbolMap = Record<ViewRegionType, RegionSymbol>;

export function convertToSymbolName(region: AbstractRegion) {
  const regionType = region.type;
  if (!regionType) return;
  if (region.subType === ViewRegionSubType.EndTag) return;

  const attributeValue = `${region.attributeName ?? ''}="${
    region.attributeValue ?? ''
  }"`;
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
    Import: {
      label: 'import',
      icon: SymbolKind.Constructor,
      value: region.regionValue ?? '',
    }, //
    RepeatFor: {
      label: 'repeat',
      icon: SymbolKind.Enum,
      value: `${region.attributeName}="${region.regionValue}"`,
    },
    TextInterpolation: {
      label: 't-inpol',
      icon: SymbolKind.TypeParameter,
      // eslint-disable-next-line no-useless-escape
      value: `\$\{${region.regionValue}\}`,
    }, //
    ValueConverter: {
      label: 'vc',
      icon: SymbolKind.Property,
      value: attributeValue,
    }, //
  };

  if (CustomElementRegion.is(region)) {
    if (region.data?.length) {
      const finalChildrenSymbol: DocumentSymbol[] = [];
      region.data.forEach((subRegion) => {
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
