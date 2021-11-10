export interface OtherInterface {
  from: {
    other: string;
  };
}
export class OtherCustomElementCustomElement {
  @bindable otherFoo: string[];
  @bindable otherBar;
  otherQux: OtherInterface[];
  otherUseQux() {
    this.otherQux[0];
  }
}
