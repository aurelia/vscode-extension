import { bindable } from 'aurelia-framework';

interface More {
  alright: number;
}

interface ICompoInter {
  stringInter: string;
  complex?: number;
  mooore?: More;
}

class CustomError extends Error {
  constructor() {
    super();
  }
}

/**
 * Docs for MyCompoCustomElement
 */
export class MyCompoCustomElement {
  /**
   * A bindable for strings
   */
  @bindable public stringBindable: string = 'foo';

  @bindable public interBindable: ICompoInter = {
    stringInter: 'stringInter',
  };

  constructor() {
    this.oneOtherMethod(3322, { stringInter: 'hi' });
  }

  private stringArray: string[] = ['hello', 'world'];

  public what = 'helo';

  /**
   * Here doc it
   */
  private oneOtherMethod(someVar: number, moreToCome: ICompoInter): string[] {
    if (someVar && moreToCome) {
      return this.stringArray;
    }

    return [''];
  }
}
