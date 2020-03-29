import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class ProgressElement extends MozDocElement {

  public documentation = `The HTML <progress> element represents the completion progress of a task, typically
  displayed as a progress bar.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress';

    this.attributes.set('max',
      new BindableAttribute(`This attribute describes how much work the task indicated by the progress element requires. The max attribute, if present,
      must have a value greater than zero and be a valid floating point number. The default value is 1.`));
    this.attributes.set('value',
      new BindableAttribute(`This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0
      and max, or between 0 and 1 if max is omitted. If there is no value attribute, the progress bar is indeterminate; this indicates that an
      activity is ongoing with no indication of how long it is expected to take.`));
  }
}
