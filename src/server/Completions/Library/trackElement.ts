import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class TrackElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <track> element is used as a child of the media elements—<audio> and <video>. 
  It lets you specify timed text tracks (or time-based data), for example to automatically handle subtitles. 
  The tracks are formatted in WebVTT format (.vtt files) — Web Video Text Tracks.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('default',
      new Attribute(`This attribute indicates that the track should be enabled unless the user's preferences 
      indicate that another track is more appropriate. This may only be used on one track element per media element.`));
    this.attributes.set('kind',
      new Attribute(`How the text track is meant to be used. If omitted the default kind is subtitles. If the attribute is
       not present, it will use the subtitles. If the attribute contains an invalid value, it will use metadata.
        (Versions of Chrome earlier than 52 treated an invalid value as subtitles.) `));
    this.attributes.set('label',
      new Attribute(`A user-readable title of the text track which is used by the browser when listing available text tracks.`));
    this.attributes.set('src',
      new Attribute(`Address of the track (.vtt file). Must be a valid URL. This attribute must be defined.`));
    this.attributes.set('srclang',
      new Attribute(`Language of the track text data. It must be a valid BCP 47 language tag. If the kind attribute is set 
      to subtitles, then srclang must be defined.`));
    this.events = GlobalAttributes.events;
  }
}
