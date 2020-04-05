import { HtmlTemplateDocument } from './HtmlTemplateDocument';
import { ViewModelDocument, Methods } from './ViewModelDocument';

interface IClassDefinition {
  name: string;
  methods: Methods;
}

export class WebComponent {
  public constructor(public name: string) {}

  public document: HtmlTemplateDocument;
  public viewModel: ViewModelDocument;
  public paths: string[] = [];
  public classes: IClassDefinition[] = [];
}
