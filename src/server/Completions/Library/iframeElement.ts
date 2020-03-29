import { BindableAttribute, Value, MozDocElement } from './_elementStructure';

export default class IframeElement extends MozDocElement {

  public documentation = `The HTML Inline Frame Element <iframe> represents a nested browsing context, effectively
   embedding another HTML page into the current page. In HTML 4.01, a document may contain a head and a body or a
   head and a frameset, but not both a body and a frameset. However, an <iframe> can be used within a normal
   document body. Each browsing context has its own session history and active document. The browsing context
   that contains the embedded content is called the parent browsing context. The top-level browsing context
   (which has no parent) is typically the browser window.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe';

    this.attributes.set('allowfullscreen',
      new BindableAttribute(`This attribute can be set to true if the frame is allowed to be placed into full screen mode by calling its Element.requestFullscreen() method. If this isn't set, the element can't be placed into full screen mode.`));
    this.attributes.set('frameborder',
      new BindableAttribute(`The value 1 (the default) tells the browser to draw a border between this frame and every other frame. The value 0 tells the browser not to draw a border between this frame and other frames.`));
    this.attributes.set('height',
      new BindableAttribute(`Indicates the height of the frame HTML5 in CSS pixels, or HTML 4.01 in pixels or as a percentage.`));
    this.attributes.set('longdesc',
      new BindableAttribute(`A URI of a long description of the frame. Due to widespread misuse, this is not helpful for non-visual browsers.`));
    this.attributes.set('marginheight',
      new BindableAttribute(`The amount of space in pixels between the frame's content and its top and bottom margins.`));
    this.attributes.set('marginwidth',
      new BindableAttribute(`The amount of space in pixels between the frame's content and its left and right margins.`));
    this.attributes.set('name',
      new BindableAttribute(`A name for the embedded browsing context (or frame). This can be used as the value of the target attribute of an <a> or <form> element, or the formtarget attribute of an <input> or <button> element.`));
    this.attributes.set('scrolling',
      new BindableAttribute(`Enumerated attribute indicating when the browser should provide a scroll bar (or other scrolling device) for the frame`,
        null,
        null,
        null,
        null,
        new Map([
          ['auto', new Value(`Only when needed`)],
          ['yes', new Value(`Always provide a scroll bar`)],
          ['no', new Value(`Never provide a scroll bar`)]
        ])));
    this.attributes.set('sandbox',
      new BindableAttribute(`If specified as an empty string, this attribute enables extra restrictions on the content that can appear in the inline frame. The value of the attribute can either be an empty string (all the restrictions are applied), or a space-separated list of tokens that lift particular restrictions.`,
        null,
        null,
        null,
        null,
        new Map([
          ['allow-forms', new Value(`Allows the embedded browsing context to submit forms. If this keyword is not used, this operation is not allowed.`)],
          ['allow-modals', new Value(`Allows the embedded browsing context to open modal windows.`)],
          ['allow-orientation-lock', new Value(`Allows the embedded browsing context to disable the ability to lock the screen orientation.`)],
          ['allow-pointer-lock', new Value(`Allows the embedded browsing context to use the Pointer Lock API.`)],
          ['allow-popups', new Value(`Allows popups (like from window.open, target="_blank", showModalDialog). If this keyword is not used, that functionality will silently fail.`)],
          ['allow-popups-to-escape-sandbox', new Value(`Allows a sandboxed document to open new windows without forcing the sandboxing flags upon them. This will allow, for example, a third-party advertisement to be safely sandboxed without forcing the same restrictions upon a landing page.`)],
          ['allow-presentation', new Value(`Allows embedders to have control over whether an iframe can start a presentation session.`)],
          ['allow-same-origin', new Value(`Allows the content to be treated as being from its normal origin. If this keyword is not used, the embedded content is treated as being from a unique origin.`)],
          ['allow-scripts', new Value(`Allows the embedded browsing context to run scripts (but not create pop-up windows). If this keyword is not used, this operation is not allowed.`)],
          ['allow-top-navigation', new Value(`Allows the embedded browsing context to navigate (load) content to the top-level browsing context. If this keyword is not used, this operation is not allowed.`)],
        ])));
    this.attributes.set('src',
      new BindableAttribute(`The URL of the page to embed.`));
    this.attributes.set('srcdoc',
      new BindableAttribute(`The content of the page that the embedded context is to contain. This attribute is expected to generally be used together with the sandbox attribute. If a browser supports the srcdoc attribute, it will override the content specified in the src attribute (if present). If a browser does NOT support the srcdoc attribute, it will show the file specified in the src attribute instead (if present). Note that if the content of the attribute contains a script tag then a closing script tag is required for the script to run, even if nothing else comes after the script.`));
    this.attributes.set('width',
      new BindableAttribute(`Indicates the width of the frame HTML5 in CSS pixels, or HTML 4.01 in pixels or as a percentage.`));
  }
}
