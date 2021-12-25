import { customElement, bindable } from 'aurelia';
import template from './minimal-component.html';

interface MyInter {
  field: {
    nested: string;
  };
}

interface ShortInter {
  interA: {
    Binter: number;
  };
}

@customElement({
  name: 'minimal-component',
  template,
})
export class MinimalComponent {
  /** minimal */
  minimalVar: string = 'minimal';

  @bindable
  minimalBindable: number = 789;

  minimalInterfaceVar: MyInter;

  inter: ShortInter;
}
