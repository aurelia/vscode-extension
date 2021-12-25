@customElement({ name: 'custom-element', template })
export class CustomElementCustomElement {
  @bindable foo: string = '';
  @bindable bar;
  qux;

  useFoo() {
    this.foo;
  }
}
