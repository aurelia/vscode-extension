import { Attribute, Value } from './_elementStructure';

export default class AElement {

  public name = 'a';

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a';
  public licenseText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.`;

  public attributes: Map<string, Attribute> = new Map([
      [
        'download',
        new Attribute(`This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). There are no restrictions on allowed values, though / and \ are converted to underscores. Most file systems limit some punctuation in file names, and browsers will adjust the suggested name accordingly.`)
      ],  
       [
        'href',
        new Attribute(`ontains a URL or a URL fragment that the hyperlink points to.
A URL fragment is a name preceded by a hash mark (#), which specifies an internal target location (an ID of an HTML element) within the current document. URLs are not restricted to Web (HTTP)-based documents, but can use any protocol supported by the browser. For example, file:, ftp:, and mailto: work in most browsers.
This attribute may be omitted (as of HTML5) to create a placeholder link. A placeholder link resembles a traditional hyperlink, but does not lead anywhere.`)
      ],   
      [
        'hreflang',
        new Attribute(`This attribute indicates the human language of the linked resource. It is purely advisory, with no built-in functionality. Allowed values are determined by BCP47.`)
      ],
      [
        'referrerpolicy',
        new Attribute(`Indicates which referrer to send when fetching the URL.`, 
          null,
          null,
          null,
          null,
          new Map([
            ['no-referrer', new Value(`means the Referer: header will not be sent.`)],
            ['no-referrer-when-downgrade', new Value(`means no Referer: header will be sent when navigating to an origin without HTTPS. This is the default behavior.`)],
            ['origin', new Value(`means the referrer will be the origin of the page, not including information after the domain.`)],
            ['origin-when-cross-origin', new Value(`meaning that navigations to other origins will be limited to the scheme, the host and the port, while navigations on the same origin will include the referrer's path.`)],
            ['unsafe-url', new Value(`means the referrer will include the origin and path, but not the fragment, password, or username. This is unsafe because it can leak data from secure URLs to insecure ones.`)]
          ]))
      ],
      [
        'rel',
        new Attribute(`Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).`)
      ],
      [
        'target',
        new Attribute(`Specifies where to display the linked URL. It is a name of, or keyword for, a browsing context: a tab, window, or <iframe>.`, 
          null,
          null,
          null,
          null,
          new Map([
            ['_self', new Value(`Load the URL into the same browsing context as the current one. This is the default behavior.`)],
            ['_blank', new Value(`Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.`)],
            ['_parent', new Value(` Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as _self.`)],
            ['_top', new Value(`Load the URL into the top-level browsing context (that is, the "highest" browsing context that is an ancestor of the current one, and has no parent). If there is no parent browsing context, this behaves the same way as _self.`)]
          ]))
      ], 
      [
        'type',
        new Attribute(`Specifies the media type in the form of a MIME type for the linked URL. This is provided strictly as advisory information; there is no built-in behavior for it.`)
      ]
  ]);
}
