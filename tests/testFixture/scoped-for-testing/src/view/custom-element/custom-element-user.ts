import { CustomElementCustomElement } from './custom-element';
import { OtherInterface } from './other-custom-element-user';

export class CustomElementUserCustomElement {
  @bindable fooUser;
  @bindable barUser;
  quxUser;
  userObject: OtherInterface;

  binding() {
    this.quxUser
  }
}

CustomElementCustomElement;
