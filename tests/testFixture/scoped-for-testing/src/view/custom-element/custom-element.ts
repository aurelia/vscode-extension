@customElement({ name: 'custom-element', template })
export class CustomElementCustomElement {
  @bindable foo;
  @bindable bar;
  qux;

  useFoo() {
    this.foo;
  }
}
