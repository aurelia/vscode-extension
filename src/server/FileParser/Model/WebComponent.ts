import { HtmlTemplateDocument } from './HtmlTemplateDocument';
import { ViewModelDocument } from './ViewModelDocument';

export class WebComponent {
  public constructor(public name: string) {

  }

  public document: HtmlTemplateDocument;
  public viewModel: ViewModelDocument;

  public paths: string[] = [];

  public classes = [];
}
