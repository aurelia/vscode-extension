import { customElement } from 'aurelia';
import template from './view-model-test.html';

@customElement({
  name: 'view-model-test',
  template,
})
export class ViewModelTest {
  functionVariable: () => Promise<void>;

  methodWithArgs(first: string, second: number) {}
}
