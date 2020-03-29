import { WebComponent } from './WebComponent';
import { singleton } from 'aurelia-dependency-injection';

@singleton()
export class AureliaApplication {

  constructor() {
  }

  public components: WebComponent[] = [];
}
