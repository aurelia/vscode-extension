import { ViewModelDocument } from './FileParser/Model/ViewModelDocument';
export declare type DefinitionsInfo = {
  [name: string]: DefinitionLink[];
};

declare type DefinitionsAttributesInfo = {
  [name: string]: {
    customElementName: string;
    asCamelCase: string;
  }[];
};

declare type AureliaDefinition = {
  definitionsInfo: DefinitionsInfo;
  definitionsAttributesInfo: DefinitionsAttributesInfo;
};

import {
  Location,
  DefinitionLink,
  LocationLink,
  Range,
  MarkedString,
  Position,
} from 'vscode-languageserver';
import * as path from 'path';
import { AureliaConfigProperties } from '../client/Model/AureliaConfigProperties';
import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { camelCase } from 'aurelia-binding';
import { WebComponent } from './FileParser/Model/WebComponent';
import { HtmlTemplateDocument } from './FileParser/Model/HtmlTemplateDocument';
import { DefinitionInfo } from 'typescript';
import RelatedFileExtensions from '../Util/RelatedFileExtensions';
import { kebabCase } from '../Util/kebabCase';

function storeViewModelDefinitions(
  propName: string,
  component: WebComponent,
  definitionsInfo: DefinitionsInfo
): DefinitionsInfo {
  const { viewModel } = component;
  if (!viewModel[propName]) return;

  // 1.1 Find target path
  const { scriptExtensions } = RelatedFileExtensions;
  const viewModelPath = component.paths.find(path => {
    return scriptExtensions.some(ext => {
      ext;
      return path.endsWith(ext);
    });
  });
  const targetUri = `${viewModelPath}`;

  viewModel[propName].forEach(property => {
    const { range } = property;
    const targetRange = Range.create(range.start, range.end);

    const def = definitionsInfo[property.name] || [];
    def.push(
      LocationLink.create(
        targetUri,
        targetRange,
        targetRange,
      )
    );

    definitionsInfo[property.name] = def;
  });
  return definitionsInfo;
}

/**
 * Store definitions from an aurelia view, eg.
 * - 1. `repeat.for=">>>button<<< of buttons"`
 * - 2. `<div >>>my-attr<<<.bind=""></div>
 */
function storeViewDefinitions(
  component: WebComponent,
  aureliaApplication: AureliaApplication,
  definitionsInfo: DefinitionsInfo,
  definitionsAttributesInfo: DefinitionsAttributesInfo,
) {
  const viewDocument = component.document;
  if (!viewDocument) return;

  const { scriptExtensions } = RelatedFileExtensions;
  const tags = viewDocument.tags.filter(tag => {
    const isDontParseTags = (tag.name === 'template') || (tag.name === 'require');
    const isStartTag = !isDontParseTags && tag.startTag;
    return (!isDontParseTags && tag.startTag); // omit closing tags
  });

  tags.forEach(tag => {
    const customElementName = tag.name;
    tag.attributes.forEach(attr => {
      /**
       * 1.
       * TODO: Cursor at the end of the line, and not directly where the value was defined, ie.
       * `repeat.for="button of buttons"|`
       * But we want `repeat.for="|button of buttons"`
       * Fix approach: get startOffSet from `repeat.for` attribute
       * (because parse5 only gives us attr positions)
       * then + 12 (= num of char in `repeat.for="`) to get the beginning of value.
       */
      if (attr.name === 'repeat') {
        /* eg. value = 'button of buttons' */
        const { value } = attr;
        const definitionWord = value.split(' ')[0]; /* button */
        const targetViewUri = `${viewDocument.path}`;
        /* parse5 line index starts 1 */
        const lineNum = tag.line - 1;

        const targetRange = Range.create(
          Position.create(lineNum, attr.startOffset),
          Position.create(lineNum, attr.endOffset),
        );

        const def = definitionsInfo[definitionWord] || [];
        def.push(
          LocationLink.create(
            targetViewUri,
            targetRange,
            targetRange,
          )
        );
        definitionsInfo[definitionWord] = def;
      }

      /*
       * 2.
       * Here, I assume, that .binding will only be true for valid attr. bindings
       */
      const aureliaBindings: string[] = ["bind", "to-view", "one-way", "from-view", "two-way", "one-time", "call"];

      // if (attr.binding === 'bind') {
      if (aureliaBindings.includes(attr.binding)) {
        const { name: bindingName } = attr;

        // check if is reference
        const references = viewDocument.references;
        const getFileName = (filePath: string): string => {
          return path.parse(filePath).name;
        };
        const foundRefs = references.map(ref => {
          return getFileName(ref.path);
        });
        if (!foundRefs.includes(customElementName)) return;

        const targetViewPath = aureliaApplication.components
          .find(component => {
            return (component.name === customElementName);
          })
          .paths.find(path => {
            return scriptExtensions.some(ext => path.endsWith(ext));
          });
        const targetViewUri = `${targetViewPath}`;

        /* parse5 line index starts 1 */
        const lineNum = tag.line - 1;

        const targetRange = Range.create(
          Position.create(lineNum, attr.startOffset),
          Position.create(lineNum, attr.endOffset),
        );

        const asCamelCase = camelCase(bindingName);
        const def = definitionsAttributesInfo[bindingName] || [];
        def.push(
          {
            customElementName,
            asCamelCase,
          }
        );
        definitionsAttributesInfo[bindingName] = def;
      }
    });
  });
  return {
    definitionsInfo,
    definitionsAttributesInfo
  };
}

/**
 *
 */
function storeCustomElementDefinitions(
  component: WebComponent,
  definitionsInfo: DefinitionsInfo,
) {
  const { name, paths } = component;
  const targetRange = Range.create(
    Position.create(0, 0),
    Position.create(0, 6),
  );
  /** Assume, there is no name class with custom elements name */
  definitionsInfo[name] = [{
    targetRange,
    targetSelectionRange: targetRange,
    targetUri: paths[1] // quick win: 1 is the .ts file
  }];
}

/**
 * After all view model variables/methods were collected,
 * converted them to kebab case (for goto in view).
 */
function convertViewModelVariablesToKebabCase(definitionsInfo: DefinitionsInfo, definitionsAttributesInfo: DefinitionsAttributesInfo): AureliaDefinition {
  Object.entries(definitionsInfo).forEach(([key, attrInfos]) => {
    attrInfos.forEach(attrInfo => {
      const asKebabCase = kebabCase(key);
      definitionsInfo[asKebabCase] = definitionsInfo[key];
    });
  });

  return {
    definitionsInfo,
    definitionsAttributesInfo,
  };
}

export function exposeAureliaDefinitions(
  aureliaApplication: AureliaApplication,
): AureliaDefinition {
  let definitionsInfo: DefinitionsInfo = {};
  let definitionsAttributesInfo: DefinitionsAttributesInfo = {};

  aureliaApplication.components.forEach(component => {
    if (!component.viewModel) return;

    storeViewModelDefinitions('properties', component, definitionsInfo);
    storeViewModelDefinitions('methods', component, definitionsInfo);
    storeCustomElementDefinitions(component, definitionsInfo);

    storeViewDefinitions(component, aureliaApplication, definitionsInfo, definitionsAttributesInfo);
  });

  ({ definitionsInfo, definitionsAttributesInfo } = convertViewModelVariablesToKebabCase(definitionsInfo, definitionsAttributesInfo));

  return {
    definitionsInfo,
    definitionsAttributesInfo
  };
}
