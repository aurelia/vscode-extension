import { ViewModelDocument } from './FileParser/Model/ViewModelDocument';
export declare type DefinitionsInfo = {
  [name: string]: DefinitionLink[];
}

import {
  Location,
  DefinitionLink,
  LocationLink,
  Range,
  MarkedString,
  Position,
} from 'vscode-languageserver';
import { AureliaConfigProperties } from '../client/Model/AureliaConfigProperties';
import { AureliaApplication } from './FileParser/Model/AureliaApplication';
import { camelCase } from 'aurelia-binding';
import { WebComponent } from './FileParser/Model/WebComponent';
import { HtmlTemplateDocument } from './FileParser/Model/HtmlTemplateDocument';

function storeDefinitions(
  propName: string,
  component: WebComponent,
  extensionsFromSettings: AureliaConfigProperties['relatedFiles'],
): DefinitionsInfo {
  const { viewModel } = component;
  if (!viewModel[propName]) return;

  const definitionsInfo: DefinitionsInfo = {};
  // 1.1 Find target path
  const { script: scriptExtension } = extensionsFromSettings;
  const viewModelPath = component.paths.find(path => {
    return path.endsWith(scriptExtension);
  });
  const targetUri = `file://${viewModelPath}`;

  viewModel[propName].forEach(property => {
    const { range } = property
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
}

function storeViewDefinitions(
  component: WebComponent,
  aureliaApplication: AureliaApplication,
  extensionsFromSettings: AureliaConfigProperties['relatedFiles'],
) {
  const viewDocument = component.document;
  if (!viewDocument) return;

  const definitionsInfo: DefinitionsInfo = {};
  const definitionsAttributesInfo = {};

  const { script: scriptExtension } = extensionsFromSettings;
  const tags = viewDocument.tags.filter(tag => {
    const isDontParseTags = (tag.name === 'template') || (tag.name === 'require');
    const isStartTag = !isDontParseTags && tag.startTag;
    return (!isDontParseTags && tag.startTag) // omit closing tags
  });

  tags.forEach(tag => {
    const customElementName = tag.name;
    tag.attributes.forEach(attr => {
      if (attr.name === 'repeat') {
        /* eg. value = 'button of buttons' */
        const { value } = attr;
        const definitionWord = value.split(' ')[0];
        const targetViewUri = `file://${viewDocument.path}`;
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
       * Here, I assume, that .binding will only be true for valid attr. bindings
       */
      if (attr.binding === 'bind') {
        const { name: bindingName } = attr;

        // check if is reference
        const references = viewDocument.references;
        const getFileName = (path: string): string => {
          return path.split('/').pop().replace(/\..+/, '');
        }
        const foundRefs = references.map(ref => {
          return getFileName(ref.path);
        });
        if (!foundRefs.includes(customElementName)) return;
        customElementName
        // find in aurelai components
        const targetViewPath = aureliaApplication.components
          .find(component => {
            return (component.name === customElementName)
          })
          .paths.find(path => {
            return path.endsWith(scriptExtension)
          });
        const targetViewUri = `file://${targetViewPath}`;

        /* parse5 line index starts 1 */
        const lineNum = tag.line - 1;

        const targetRange = Range.create(
          Position.create(lineNum, attr.startOffset),
          Position.create(lineNum, attr.endOffset),
        );

        const asCamelCase = camelCase(bindingName);
        // definitionsInfo[bindingName] = definitionsInfo[asCamelCase];
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
}

export function exposeAureliaDefinitions(
  extensionsFromSettings: AureliaConfigProperties['relatedFiles'],
  aureliaApplication: AureliaApplication,
): { definitionsInfo: DefinitionsInfo, definitionsAttributesInfo: {} } {
  let propertiesDefinition: DefinitionsInfo = {};
  let methodsDefinitions: DefinitionsInfo = {};
  let definitionsAttributesInfo: any = {};

  // 1. For each component
  aureliaApplication.components.forEach(component => {
    if (!component.viewModel) return;

    propertiesDefinition = storeDefinitions('properties', component, extensionsFromSettings);
    methodsDefinitions = storeDefinitions('methods', component, extensionsFromSettings);

    definitionsAttributesInfo = storeViewDefinitions(component, aureliaApplication, extensionsFromSettings);
  });

  return {
    definitionsInfo: {
      ...propertiesDefinition,
      ...methodsDefinitions,
    },
    definitionsAttributesInfo
  };
}
