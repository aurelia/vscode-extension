import { HtmlTemplateDocument } from './HtmlTemplateDocument';
import { ViewModelDocument } from './ViewModelDocument';

export class WebComponent {
  constructor(public name: string) {

  }

  public document: HtmlTemplateDocument;
  public viewModel: ViewModelDocument;

  public paths = [];

  public classes = [];
}
