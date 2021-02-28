import { bindable, customElement } from "aurelia-framework";

interface Alliteration {
  wait: string;
}

interface Grammar {
  id: number;
  saying: string;
  alliteration: Alliteration;
}

@customElement("compo-user")
export class CompoUser {
  @bindable thisIsMe: string = "hello";

  message: string = "compo user";

  counter: number = 0;

  grammarRules: Grammar[];

  rule: Grammar;

  increaseCounter(inpu: string[]): number {
    return 1;
  }
}
