import { Aurelia, bindable } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export class ComponentUser {
  @bindable saying: string;
  @bindable fareWell: string = 'standard fare';
  @bindable shouting: string;

  public message: string = 'Hello Hello!';
}
