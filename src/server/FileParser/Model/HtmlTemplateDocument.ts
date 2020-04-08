import { TemplateReference } from './TemplateReference';
import { TagDefinition } from "../HTMLDocumentParser";

export class HtmlTemplateDocument {
  public bindables: string[] = [];
  public dynamicBindables: any[] = [];
  public interpolationBindings: any[] = [];
  public tags: TagDefinition[] = [];
  public references: TemplateReference[] = [];

  public path: string;
  public name: string;

}
