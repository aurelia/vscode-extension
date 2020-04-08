import * as Path from 'path';
import { Parser } from 'aurelia-binding';
import { HtmlTemplateDocument } from "../Model/HtmlTemplateDocument";
import { TemplateReference } from "../Model/TemplateReference";
import { HTMLDocumentParser, TagDefinition } from "../HTMLDocumentParser";
import { sys } from 'typescript';

export class AureliaHtmlParser {

  public async processFile(path) {
    const template = new HtmlTemplateDocument();
    template.path = path;
    template.name = Path.basename(path, '.html').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');

    const fileContent = sys.readFile(path, 'utf-8');
    if (!fileContent.startsWith('<template')) {
      // not an Aurelia template, stop processing
      return template;
    }

    const docParser = new HTMLDocumentParser();
    const document = await docParser.parse(fileContent);
    const templateTag = document.find(tag => tag.name === 'template');
    if (templateTag) {
      template.bindables = this.getBindableValuesFrom(templateTag);
    }

    template.references = this.getRequireImportsFrom(document);
    template.dynamicBindables = this.getAttributeCommands(document);
    template.interpolationBindings = this.getStringInterpolationBindings(fileContent, document);
    template.tags = document;
    return template;
  }

  private getBindableValuesFrom(templateTag) {
    const bindableAttribute = templateTag.attributes.find(attribute => attribute.name === 'bindable');
    if (bindableAttribute?.value) {
      return bindableAttribute.value.split(',').map(i => i.trim());
    } else {
      return [];
    }
  }

  private getRequireImportsFrom(document) {

    const requireStatements = document.filter(tag => tag.name === 'require' && tag.startTag);
    const references = [];

    for (const require of requireStatements) {
      const pathAttribute = require.attributes.find(attr => attr.name === 'from');
      const asAttribute = require.attributes.find(attr => attr.name === 'as');

      let path, asElementValue;
      if (pathAttribute) {
        path = pathAttribute.value;
      }
      if (asAttribute) {
        asElementValue = asAttribute.value;
      }
      references.push(new TemplateReference(path, asElementValue));
    }

    return references;
  }

  private getAttributeCommands(document) {

    const bindings = [];
    const aureliaParser = new Parser();
    for (const element of document) {

      if (element.name === 'require' || element.name === 'template') {
        continue;
      }

      const bindingAttributes = element.attributes.filter(attr => attr.binding);
      for (const binding of bindingAttributes) {
        bindings.push({
          name: binding.name,
          value: binding.value,
          bindingType: binding.binding,
          bindingData: aureliaParser.parse(binding.value)
        });
      }

    }
    return bindings;
  }

  private getStringInterpolationBindings(fileContent: string, document: TagDefinition[]) {
    const tags = document.filter(tag => {
      const isDontParseTags = (tag.name === 'template') || (tag.name === 'require');
      const isStartTag = !isDontParseTags && tag.startTag;
      return (!isDontParseTags && tag.startTag); // omit closing tags
    });

    const bindings = [];
    const aureliaParser = new Parser();
    const interpolationRegex = /\$\{(.*)\}/g;
    let match;
    while (match = interpolationRegex.exec(fileContent)) {
      bindings.push({
        value: match[0],
        // bindingData: aureliaParser.parse(match[1]) // some files got parsing errors
      });
    }

    return bindings;
  }
}
