import { BindableAttribute, MozDocElement } from './_elementStructure';

export default class VideoElement extends MozDocElement {

  public documentation = `Use the HTML <video> element to embed video content in a document.`;

  constructor() {
    super();
    this.url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video';

    this.attributes.set('autoplay',
      new BindableAttribute(`A Boolean attribute; if specified, the video automatically begins to play 
      back as soon as it can do so without stopping to finish loading the data.`));
    this.attributes.set('buffered',
      new BindableAttribute(`An attribute you can read to determine the time ranges of the buffered media. 
      This attribute contains a TimeRanges object.`));
    this.attributes.set('controls',
      new BindableAttribute(`If this attribute is present, the browser will offer controls to allow the user to 
      control video playback, including volume, seeking, and pause/resume playback.`));
    this.attributes.set('crossorigin',
      new BindableAttribute(`This enumerated attribute indicates whether to use CORS to fetch the related image. 
      CORS-enabled resources can be reused in the <canvas> element without being tainted.`));
    this.attributes.set('height',
      new BindableAttribute(`The height of the video's display area, in CSS pixels. `));
    this.attributes.set('loop',
      new BindableAttribute(`A Boolean attribute; if specified, we will, upon reaching the end of the video, 
      automatically seek back to the start.`));
     this.attributes.set('muted',
      new BindableAttribute(`A Boolean attribute which indicates the default setting of the audio contained in the video.
      If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be 
      played when the video is played.`));
    this.attributes.set('played',
      new BindableAttribute(`A TimeRanges object indicating all the ranges of the video that have been played.`));
    this.attributes.set('preload',
      new BindableAttribute(`This enumerated attribute is intended to provide a hint to the browser about what the author
      thinks will lead to the best user experience.`));
    this.attributes.set('poster',
      new BindableAttribute(`A URL indicating a poster frame to show until the user plays or seeks. If this attribute 
      isn't specified, nothing is displayed until the first frame is available; then the first frame is shown 
      as the poster frame.`));
    this.attributes.set('src',
      new BindableAttribute(`The URL of the video to embed. This is optional; you may instead use the <source> element 
      within the video block to specify the video to embed.`));
    this.attributes.set('width',
      new BindableAttribute(`The width of the video's display area, in CSS pixels. `));
  }
}
