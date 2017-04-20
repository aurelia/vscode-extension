import { Attribute, BaseElement } from './_elementStructure';

export default class ScriptElement extends BaseElement {

  public documentation = `The HTML <script> element is used to embed or reference an executable script.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script';

    this.attributes.set('async',
      new Attribute(`Set this Boolean attribute to indicate that the browser should, if possible, execute the 
      script asynchronously. It has no effect on inline scripts (i.e., scripts that don't have the src attribute).`));  
    this.attributes.set('integrity',
      new Attribute(`Contains inline metadata that a user agent can use to verify that a fetched resource has been 
      delivered free of unexpected manipulation. See Subresource Integrity.`));  
    this.attributes.set('src',
      new Attribute(`This attribute specifies the URI of an external script; this can be used as an alternative to 
      embedding a script directly within a document. If a script element has a src attribute specified, it should 
      not have a script embedded inside its tags.`));  
    this.attributes.set('type',
      new Attribute(`This attribute identifies the scripting language of code embedded within a script element or 
      referenced via the element’s src attribute. This is specified as a MIME type; examples of supported MIME types 
      include text/javascript, text/ecmascript, application/javascript, and application/ecmascript. If this attribute 
      is absent, the script is treated as JavaScript.`)); 
    this.attributes.set('text',
      new Attribute(`Like the textContent attribute, this attribute sets the text content of the element.  Unlike the 
      textContent attribute, however, this attribute is evaluated as executable code after the node is inserted into the DOM.`));  
    this.attributes.set('defer',
      new Attribute(`This Boolean attribute is set to indicate to a browser that the script is meant to be executed 
      after the document has been parsed, but before firing DOMContentLoaded. The defer attribute should only be 
      used on external scripts.`));  
    this.attributes.set('crossorigin',
      new Attribute(`Normal script elements pass minimal information to the window.onerror for scripts which do not pass 
      the standard CORS checks. To allow error logging for sites which use a separate domain for static media, use this 
      attribute. See CORS settings attributes for a more descriptive explanation of the valid arguments.`));
  }
}
