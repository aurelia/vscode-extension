@customElement({ name: 'custom-element', template })
export class CustomElementCustomElement {
  @bindable foo: string = '';
  @bindable barBaz;
  qux;

  useFoo() {
    this.foo;
  }
}
