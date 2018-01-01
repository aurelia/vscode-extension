import {TemplateReference} from './TemplateReference';
import {TagDefinition} from './../HTMLDocumentParser';

export class HtmlTemplateDocument {
  public bindables: Array<string> = [];
  public dynamicBindables: Array<any> = [];
  public interpolationBindings: Array<any> = [];
  public tags: Array<TagDefinition> = [];
  public references: Array<TemplateReference> = [];

  public path: string;
  public name: string;

  
}
