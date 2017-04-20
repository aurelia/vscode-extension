import { Attribute, Value, GlobalAttributes, BaseElement } from './_elementStructure';

export default class AudioElement extends BaseElement {

  public documentation = `The HTML <audio> element is used to embed sound content in documents. It may contain 
  one or more audio sources, represented using the src attribute or the <source> element; the browser will choose 
  the most suitable one.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio';

    this.attributes.set('autoplay',
      new Attribute(`A Boolean attribute; if specified (even if the value is "false"!), the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.`));
    this.attributes.set('buffered',
      new Attribute(`An attribute you can read to determine which time ranges of the media have been buffered. This attribute contains a TimeRanges object.`));
    this.attributes.set('controls',
      new Attribute(`If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.`));
    this.attributes.set('loop',
      new Attribute(`A Boolean attribute; if specified, will automatically seek back to the start upon reaching the end of the audio.`,
      null,
      null,
      null,
      null,
      new Map([
          ['true', new Value(`will automatically seek back to the start upon reaching the end of the audio`)],
          ['false', new Value(`won't automatically seek back to the start upon reaching the end of the audio`)]
      ])));
    this.attributes.set('muted',
      new Attribute(`A Boolean attribute which indicates whether the audio will be initially silenced. Its default value is false.`,
      null,
      null,
      null,
      null,
      new Map([
          ['true', new Value(`indicates whether the audio will be initially silenced`)],
          ['false', new Value(`indicates whether the audio will not be silenced`)]
      ])));
    this.attributes.set('played',
      new Attribute(`A TimeRanges (https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges) object indicating all the ranges of the audio that have been played`));
    this.attributes.set('preload',
      new Attribute(`This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience.`,
      null,
      null,
      null,
      null,
      new Map([
          ['none', new Value(`indicates that the audio should not be preloaded`)],
          ['metadata', new Value(`indicates that only audio metadata (e.g. length) is fetched`)],
          ['auto', new Value(`indicates that the whole audio file could be downloaded, even if the user is not expected to use it `)]
        ])));
    this.attributes.set('src',
      new Attribute(`The URL of the audio to embed. This is subject to HTTP access controls. This is optional; you may instead use the <source> element within the audio block to specify the audio to embed.`));
    this.attributes.set('volume',
      new Attribute(`The playback volume, in the range 0.0 (silent) to 1.0 (loudest).`));           

    this.events = GlobalAttributes.mediaEvents;
  }
}
