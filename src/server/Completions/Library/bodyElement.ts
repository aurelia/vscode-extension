import { Event, MozDocElement } from './_elementStructure';

export default class BodyElement extends MozDocElement {

  public documentation = `The HTML <body> Element represents the content of an HTML document. There can be only one <body> element in a document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body';
    this.areaRolesAllowed = false;
    this.events.set('afterprint', new Event(
      'The afterprint event is fired after the associated document has started printing or the print preview has been closed.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/afterprint'));
    this.events.set('beforeprint', new Event(
      'The beforeprint event is fired when the associated document is about to be printed or previewed for printing.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/beforeprint'));
    this.events.set('beforeunload', new Event(
      'The beforeunload event is fired when the window, the document and its resources are about to be unloaded.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload',
      false,
true));
    this.events.set('blur', new Event(
      'The blur event is fired when an element has lost focus.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/blur'));
    this.events.set('error', new Event(
      'The error event is fired when a resource failed to load.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/error'));
    this.events.set('focus', new Event(
      'The focus event is fired when an element has received focus.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/focus'));
    this.events.set('hashchange', new Event(
      'The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol).',
      'https://developer.mozilla.org/en-US/docs/Web/Events/hashchange',
      true,
false));
    this.events.set('load', new Event(
      'The load event is fired when a resource and its dependent resources have finished loading',
      'https://developer.mozilla.org/en-US/docs/Web/Events/load'));
    this.events.set('offline', new Event(
      'The offline event is fired when the browser has lost access to the network and the value of navigator.onLine switched to false.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/offline'));
    this.events.set('online', new Event(
      'The online event is fired when the browser has gained access to the network and the value of navigator.onLine switched to true.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/online'));
    this.events.set('popstate', new Event(
      `The popstate event is fired when the active history entry changes. If the history entry being activated was created by a call to history.pushState() or was affected by a call to history.replaceState(), the popstate event's state property contains a copy of the history entry's state object.`,
      'https://developer.mozilla.org/en-US/docs/Web/Events/popstate'));
    this.events.set('redo', new Event(
      'Function to call when the user has moved forward in undo transaction history.'));
    this.events.set('resize', new Event(
      'The resize event is fired when the document view has been resized.',
      'https://developer.mozilla.org/en-US/docs/Web/Events/resize'));
    this.events.set('storage', new Event(
      'The storage event is fired when a storage area (localStorage or sessionStorage) has been modified',
      'https://developer.mozilla.org/en-US/docs/Web/Events/storage'));
    this.events.set('undo', new Event(
      'Function to call when the user has moved backward in undo transaction history.'));
    this.events.set('unload', new Event(
      'https://developer.mozilla.org/en-US/docs/Web/Events/unload',
      'The unload event is fired when the document or a child resource is being unloaded.'));
  }
}
