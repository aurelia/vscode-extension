import { bindable } from "aurelia-framework";

interface ICompoInter {
  stringInter: string
}

export class MyCompoCustomElement {
  @bindable stringBindable: string = 'foo';

  @bindable numberBindable: number = 123;

  @bindable stringArrayBindable: string[] = ['hello', 'world'];

  @bindable interBindable: ICompoInter = {
    stringInter: 'stringInter',
  }
}
