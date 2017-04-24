export class Value {
  constructor(public documentation: string = '') {
    
  }
}

class BaseAttribute {
  constructor(
    public documentation: string,
    public url: string,
    public customLabel: string = null,
    public values: Map<string, Value> = new Map()) { }
}

export class SimpleAttribute extends BaseAttribute {
  constructor(
      documentation: string, 
      url: string = null, 
      customLabel: string = null, 
      values: Map<string, Value> = new Map()) {
    super(documentation, url, customLabel, values);
  }
}

export class EmptyAttribute extends BaseAttribute {
  constructor(
      documentation: string, 
      url: string = null, 
      customLabel: string = null) {
    super(documentation, url, customLabel);
  }
}

export class BindableAttribute extends BaseAttribute {
  constructor(
    documentation: string,
    url: string = null,
    public customSnippet: string = null,
    public customBindingSnippet: string = null,
    customLabel: string = null,
    values: Map<string, Value> = new Map()) { 
      super(documentation, url, customLabel, values);
    }
}

export class Event {
  constructor(
    public documentation: string,
    public url: string = null,
    public bubbles: boolean = false,
    public cancelable: boolean = false
  ) { }
}

export class GlobalAttributes {
  public static attributes: Map<string, BaseAttribute> = new Map<string, BaseAttribute>([
      [
        'accesskey',
        new BindableAttribute(`Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey')
      ],
      [
        'class',
        new BindableAttribute(`Is a space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class')
      ],
      [
        'contenteditable',
        new BindableAttribute(`Is an enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing.`,
          'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable',
          null,
          null,
          null,
          new Map([ 
            ['true', new Value(`or the empty string, which indicates that the element must be editable.`)],
            ['fase', new Value(`indicates that the element must not be editable.`)]
          ])
        )
      ],   
      [
        'contextmenu',
        new BindableAttribute(`Is the id of an <menu> (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu) to use as the contextual menu for this element.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contextmenu')
      ],  
      [
        'data-*',
        new BindableAttribute(`Forms a class of attributes, called custom data attributes, that allow proprietary information to be exchanged between the HTML and its DOM representation that may be used by scripts. All such custom data are available via the HTMLElement interface of the element the attribute is set on. The HTMLElement.dataset property gives access to them.`, 
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*',
        'data-$1="$0"', 
        'data-$1.bind="$0"')
      ],
      ['dir', 
        new BindableAttribute(`Is an enumerated attribute indicating the directionality of the element's text.`, 
          'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir',
          null,
          null,
          null,
          new Map([ 
            ['ltr', new Value(`means left to right and is to be used for languages that are written from the left to the right (like English)`)],
            ['rtl', new Value(`means right to left and is to be used for languages that are written from the right to the left (like Arabic)`)],
            ['auto', new Value(`let the user agent decides. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then apply that directionality to the whole element.`)],
          ])
      )],      
      [
        'hidden',
        new BindableAttribute(`Is a Boolean attribute indicates that the element is not yet, or is no longer, relevant. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden')
      ],              
      [
        'id',
        new BindableAttribute(`Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id')
      ],  
      [
        'lang',
        new BindableAttribute(`Participates in defining the language of the element, the language that non-editable elements are written in or the language that editable elements should be written in. The tag contains one single entry value in the format defines in the Tags for Identifying Languages (BCP47) IETF document. xml:lang has priority over it.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang')
      ],        

      [
        'slot',
        new BindableAttribute(`Assigns a slot in a shadow DOM shadow tree to an element: An element with a slot attribute is assigned to the slot created by the <slot> element whose name attribute's value matches that slot attribute's value.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/slot')
      ],        
      [
        'style',
        new BindableAttribute(`Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the <style> element have mainly the purpose of allowing for quick styling, for example for testing purposes.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style')
      ],        
      [
        'tabindex',
        new BindableAttribute(`Is an integer attribute indicates if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex')
      ], 
      [
        'title',
        new BindableAttribute(`Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip.`,
        'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title')
      ], 
      [
        'translate',
        new BindableAttribute(`Is an enumerated attribute that is used to specify whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged`,
         'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate',
         null,
         null,
         null,
         new Map([ 
            ['yes', new Value(`or empty string, which indicates that the element will be translated.`)],
            ['no', new Value(`indicates that the element will not be translated.`)]
          ])
        )
      ],
      [
        'repeat.for',
        new BindableAttribute(
          `repeat over a set, map, or array`,
          'http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-basics/9',
          'no-snippet',
          `repeat.for="$1 of $0"`,
          `repeat.for`)
      ],
      [
        'as-element',
        new BindableAttribute(
          `In some cases, especially when creating table rows out of Aurelia custom elements, you may need to have a custom element masquerade as a standard HTML element. For example, if you're trying to fill table rows with data, you may need your custom element to appear as a <tr> row or <td> cell. This is where the as-element attribute comes in handy`,
          'http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-basics/5')
      ],
      [
        'ref',
        new SimpleAttribute(`Use the ref binding command to create a reference to a DOM element. 
        The ref command's most basic syntax is ref="expression". 
        When the view is data-bound the specified expression will be assigned the DOM element.`, 
        'http://aurelia.io/hub.html#/doc/article/aurelia/binding/latest/binding-basics/5')
      ],
      [
        'element.ref',
        new SimpleAttribute(`create a reference to the DOM element (same as ref="expression").`, 
        'http://aurelia.io/hub.html#/doc/article/aurelia/binding/latest/binding-basics/5')
      ],
      [
        'view-model.ref',
        new SimpleAttribute(`create a reference to a custom element's view-model.`, 
        'http://aurelia.io/hub.html#/doc/article/aurelia/binding/latest/binding-basics/5')
      ],
      [
        'view.ref',
        new SimpleAttribute(`create a reference to a custom element's view instance (not an HTML Element).`, 
        'http://aurelia.io/hub.html#/doc/article/aurelia/binding/latest/binding-basics/5')
      ],            
      [
        'controller.ref',
        new SimpleAttribute(`create a reference to a custom element's controller instance.`, 
        'http://aurelia.io/hub.html#/doc/article/aurelia/binding/latest/binding-basics/5')
      ], 
      [
        'innerhtml',
        new SimpleAttribute(``)
      ], 
      [
        'textcontent',
        new BindableAttribute(``)
      ],
      [
        'show',
        new BindableAttribute(`Binding to conditionally show markup in the DOM based on the value. 
        different from "if" in that the markup is still added to the DOM, simply not shown.`,
        'http://aurelia.io/hub.html#/doc/api/aurelia/templating-resources/latest/class/Show')
      ],
      [
        'if',
        new BindableAttribute(`Binding to conditionally include or not include template logic depending on returned result 
        - value should be Boolean or will be treated as such (truthy / falsey)`,
        'http://aurelia.io/hub.html#/doc/api/aurelia/templating-resources/latest/class/If')
      ],                
      [
        'with',
        new SimpleAttribute(`Binds the With with provided binding context and override context.`,
        'http://aurelia.io/hub.html#/doc/api/aurelia/templating-resources/1.4.0/class/With')
      ],        
      [
        'view-spy',
        new EmptyAttribute(`Attribute to be placed on any HTML element in a view to emit the View instance to 
        the debug console, giving you insight into the live View instance, including all child views, live bindings, behaviors and more.`,
        'http://aurelia.io/hub.html#/doc/api/aurelia/testing/1.0.0-beta.3.0.1/class/ViewSpy')
      ], 
      [
        'compile-spy',
        new EmptyAttribute(`Attribute to be placed on any element to have it emit the View Compiler's TargetInstruction into the debug console, 
        giving you insight into all the parsed bindings, behaviors and event handers for the targeted element.`,
        'http://aurelia.io/hub.html#/doc/api/aurelia/testing/1.0.0-beta.3.0.1/class/CompileSpy')
      ]    
  ]);

  public static events: Map<string, Event> = new Map<string, Event>([
    [
      'cached',
      new Event(
        `The cached event is fired when the resources listed in the application cache manifest have been downloaded, and the application is now cached.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/cached`)
    ],
    [
      'error',
      new Event(
        `The error event is fired when a resource failed to load.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/error`)
    ],
    [
      'abort',
      new Event(
        `The abort event is fired when the loading of a resource has been aborted.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/abort`)
    ],
    [
      'load',
      new Event(
        `The load event is fired when a resource and its dependent resources have finished loading.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/load`)
    ],  
    [
      'beforeunload',
      new Event(
        `The beforeunload event is fired when the window, the document and its resources are about to be unloaded.`,
      `https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload`,
      false, 
      true)
    ],
    [
      'unload',
      new Event(
        `The unload event is fired when the document or a child resource is being unloaded.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/unload`)
    ],
    [
      'online',
      new Event(
        `The online event is fired when the browser has gained access to the network and the value of navigator.onLine switched to true.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/onlines`)
    ],
    [
      'offline',
      new Event(
        `The offline event is fired when the browser has lost access to the network and the value of navigator.onLine switched to false.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/offline`)
    ],
    [
      'focus',
      new Event(
        `The focus event is fired when an element has received focus. The main difference between this event and focusin is that only the latter bubbles.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/focus`)
    ],
    [
      'blur',
      new Event(
        `The blur event is fired when an element has lost focus. The main difference between this event and focusout is that only the latter bubbles.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/blur`)
    ], 
    [
      'animationstart',
      new Event(
        `The animationstart event is fired when a CSS animation has started. If there is an animation-delay, this event will fire once the delay period has expired. A negative delay will cause the event to fire with an elapsedTime equal to the absolute value of the delay (and, correspondingly, the animation will begin playing at that time index into the sequence).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/animationstart`,
        true,
        false)
    ],
    [
      'animationend',
      new Event(
        `The animationend event is fired when a CSS animation has completed (but not if it aborts before reaching completion, such as if the element becomes invisible or the animation is removed from the element).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/animationend`,
        true,
        false)
    ],
    [
      'animationiteration',
      new Event(
        `The animationiteration event is fired when an iteration of an animation ends. This event does not occur for animations with an animation-iteration-count of one.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/animationiteration`,
        true,
        false)
    ],
    [
      'reset',
      new Event(
        `The reset event is fired when a form is reset.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/reset`,
        true,
        true)
    ],
    [
      'compositionstart',
      new Event(
        `The compositionstart event is fired when the composition of a passage of text is prepared (similar to keydown for a keyboard input, but fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/compositionstart`,
        true,
        true)
    ],
    [
      'compositionupdate',
      new Event(
        `The compositionupdate event is fired when a character is added to a passage of text being composed (fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/compositionupdate`,
        true,
        false)
    ],
    [
      'compositionend',
      new Event(
        `The compositionend event is fired when the composition of a passage of text has been completed or cancelled (fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/compositionend`,
        true,
        true)
    ],
    [
      'cut',
      new Event(
        `The cut event is fired when a selection has been removed from the document and added to the clipboard.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/cut`,
        true,
        true)
    ],
    [
      'copy',
      new Event(
        `The copy event is fired when the user initiates a copy action through the browser UI (for example, using the CTRL/Cmd+C keyboard shortcut or selecting the "Copy" from the menu) and in response to an allowed document.execCommand('copy') call.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/copy`,
        true,
        true)
    ],
    [
      'paste',
      new Event(
        `The paste event is fired when a selection has been pasted from the clipboard to the document.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/paste`,
        true,
        true)
    ],    
    [
      'keydown',
      new Event(
        `The keydown event is fired when a key is pressed down.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/keydown`,
        true,
        true)
    ],
    [
      'keyup',
      new Event(
        `The keyup event is fired when a key is released.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/keyup`)
    ],
    [
      'mouseenter',
      new Event(
        `The mouseenter event is fired when a pointing device (usually a mouse) is moved over the element that has the listener attached.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter`)
    ],
    [
      'mouseover',
      new Event(
        `The mouseover event is fired when a pointing device is moved onto the element that has the listener attached or onto one of its children.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mouseover`,
        true,
        true)
    ],
    [
      'mousemove',
      new Event(
        `The mousemove event is fired when a pointing device (usually a mouse) is moved while over an element`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mousemove`,
        true,
        true)
    ],
    [
      'mousedown',
      new Event(
        `The mousedown event is fired when a pointing device button (usually a mouse button) is pressed on an element.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mousedown`,
        true,
        true)
    ],
    [
      'mouseup',
      new Event(
        `The mouseup event is fired when a pointing device button (usually a mouse button) is released over an element.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mouseup`,
        true,
        true)
    ],
    [
      'click',
      new Event(
        `The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/click`,
        true,
        true)
    ],
    [
      'dblclick',
      new Event(
        `The dblclick event is fired when a pointing device button (usually a mouse button) is clicked twice on a single element.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dblclick`,
        true,
        true)
    ],
    [
      'contextmenu',
      new Event(
        `The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed), or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu`,
        true,
        true)
    ],
    [
      'wheel',
      new Event(
        `The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated. This event replaces the non-standard deprecated mousewheel event (https://developer.mozilla.org/en-US/docs/Web/Events/mousewheel).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/wheel`,
        true,
        true)
    ],
    [
      'mouseleave',
      new Event(
        `The mouseleave event is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mouseleave`)
    ],
    [
      'mouseout',
      new Event(
        `The mouseout event is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children. Note that it is also triggered on the parent when you move onto a child element, since you move out of the visible space of the parent.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/mouseout`,
        true,
        true)
    ],
    [
      'select',
      new Event(
        `The select event is fired when some text is being selected. The event might not be available for all elements in all languages. For example, in [HTML5],  select events can be dispatched only on form input and textarea elements.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/select`)
    ],        
    [
      'dragstart',
      new Event(
        `The dragstart event is fired when the user starts dragging an element or text selection.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dragstart`,
        true,
        true)
    ],  
    [
      'drag',
      new Event(
        `The drag event is fired when an element or text selection is being dragged (every few hundred milliseconds).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/drag`,
        true,
        true)
    ], 
    [
      'dragend',
      new Event(
        `The dragend event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dragend`,
        true,
        false)
    ], 
    [
      'dragenter',
      new Event(
        `The dragenter event is fired when a dragged element or text selection enters a valid drop target.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dragenter`,
        true,
        true)
    ], 
    [
      'dragover',
      new Event(
        `The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dragover`,
        true,
        true)
    ],  
    [
      'dragleave',
      new Event(
        `The dragleave event is fired when a dragged element or text selection leaves a valid drop target.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/dragleave`,
        true,
        false)
    ], 
    [
      'drop',
      new Event(
        `The drop event is fired when an element or text selection is dropped on a valid drop target.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/drop`,
        true,
        true)
    ], 
    [
      'touchcancel',
      new Event(
        `The touchcancel event is fired when a touch point has been disrupted in an implementation-specific manner (for example, too many touch points are created).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/touchcancel`,
        true,
        false)
    ], 
    [
      'touchend',
      new Event(
        `The touchend event is fired when a touch point is removed from the touch surface.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/touchend`,
        true,
        true)
    ], 
    [
      'touchmove',
      new Event(
        `The touchmove event is fired when a touch point is moved along the touch surface.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/touchmove`,
        true,
        true)
    ], 
    [
      'touchstart',
      new Event(
        `The touchstart event is fired when a touch point is placed on the touch surface.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/touchstart`,
        true,
        true)
    ], 
    [
      'pointerover',
      new Event(
        `The pointerover event is fired when a pointing device is moved into an element's hit test boundaries.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerover`,
        true,
        true)
    ], 
    [
      'pointerenter',
      new Event(
        `The pointerenter event fires when a pointing device is moved into the hit test boundaries of an element or one of its descendants, including as a result of a pointerdown event from a device that does not support hover (see pointerdown).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerenter`)
    ], 
    [
      'pointerdown',
      new Event(
        `The pointerdown event is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerdown`,
        true,
        true)
    ],                              
    [
      'pointermove',
      new Event(
        `The pointermove event is fired when a pointer changes coordinates.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointermove`,
        true,
        true)
    ], 
    [
      'pointerup',
      new Event(
        `The pointerup event is fired when a pointer is no longer active.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerup`,
        true,
        true)
    ], 
    [
      'pointercancel',
      new Event(
        `The pointercancel event is fired when the browser concludes the pointer will no longer be able to generate events.  For example, when a touchscreen action was triggered that was not disallowed by the touch-action CSS property.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointercancel`,
        true,
        false)
    ], 
    [
      'pointerout',
      new Event(
        `The pointerout event is fired for several reasons including: pointing device is moved out of the hit test boundaries of an element; firing the pointerup event for a device that does not support hover (see pointerup); after firing the pointercancel event (see pointercancel); when a pen stylus leaves the hover range detectable by the digitizer.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerout`,
        true,
        true)
    ], 
    [
      'pointerleave',
      new Event(
        `The pointerleave event is fired when a pointing device is moved out of the hit test boundaries of an element. For pen devices, this event is fired when the stylus leaves the hover range detectable by the digitizer.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pointerleave`)
    ], 
    [
      'gotpointercapture',
      new Event(
        `The gotpointercapture event is fired when a pointing device is moved out of the hit test boundaries of an element. For pen devices, this event is fired when the stylus leaves the hover range detectable by the digitizer.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/gotpointercapture`)
    ],
    [
      'lostpointercapture',
      new Event(
        `The lostpointercapture event is fired after pointer capture is released for a pointer.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/lostpointercapture`)
    ],
  ]);

  public static mediaEvents: Map<string, Event> = new Map<string, Event>([
    [
      'abort',
      new Event(
        `Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.`)
    ],
    [
      'canplay',
      new Event(
        `Sent when enough data is available that the media can be played, at least for a couple of frames.  This corresponds to the HAVE_ENOUGH_DATA readyState.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/canplay`)
    ],
    [
      'canplaythrough',
      new Event(
        `Sent when the ready state changes to CAN_PLAY_THROUGH, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level. It will also be fired when playback is toggled between paused and playing. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/canplaythrough`)
    ],
    [
      'durationchange',
      new Event(
        `The metadata has loaded or changed, indicating a change in duration of the media.  This is sent, for example, when the media has loaded enough that the duration is known.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/durationchange`)
    ],
    [
      'emptied',
      new Event(
        `The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/emptied`)
    ],
    [
      'ended',
      new Event(
        `Sent when playback completes.`)
    ],
    [
      'error',
      new Event(
        `Sent when an error occurs.  The element's error attribute contains more information. See Error handling for details.`)
    ],
    [
      'interruptbegin',
      new Event(
        `Sent when audio playing on a Firefox OS device is interrupted, either because the app playing the audio is sent to the background, or audio in a higher priority audio channel begins to play. See Using the AudioChannels API (https://developer.mozilla.org/en-US/docs/Web/API/AudioChannels_API/Using_the_AudioChannels_API) for more details.`,)
    ],
    [
      'interruptend',
      new Event(
        `Sent when previously interrupted audio on a Firefox OS device commences playing again — when the interruption ends. This is when the associated app comes back to the foreground, or when the higher priority audio finished playing. See Using the AudioChannels API (https://developer.mozilla.org/en-US/docs/Web/API/AudioChannels_API/Using_the_AudioChannels_API) for more details.`)
    ],
    [
      'loadeddata',
      new Event(
        `The first frame of the media has finished loading.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/loadeddata`)
    ], 
    [
      'loadedmetadata',
      new Event(
        `The media's metadata has finished loading; all attributes now contain as much useful information as they're going to.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/loadedmetadata`)
    ], 
    [
      'loadstart',
      new Event(
        `Sent when loading of the media begins.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/loadstart`)
    ], 
    [
      'pauze',
      new Event(
        `Sent when playback is paused.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/pause`)
    ], 
    [
      'play',
      new Event(
        `Sent when playback of the media starts after having been paused; that is, when playback is resumed after a prior pause event.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/play`)
    ], 
    [
      'playing',
      new Event(
        `Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/playing`)
    ], 
    [
      'progress',
      new Event(
        `Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's buffered attribute.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/progress`)
    ],
    [
      'ratechange',
      new Event(
        `Sent when the playback speed changes.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/ratechange`)
    ],
    [
      'seeked',
      new Event(
        `Sent when a seek operation completes.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/seeked`)
    ],
    [
      'seeking',
      new Event(
        `Sent when a seek operation begins.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/seeking`)
    ],
    [
      'stalled',
      new Event(
        `Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/stalled`)
    ],
    [
      'suspend',
      new Event(
        `Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/suspend`)
    ],
    [
      'timeupdate',
      new Event(
        `The time indicated by the element's currentTime attribute has changed.`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/timeupdate`)
    ],
    [
      'volumechange',
      new Event(
        `Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/volumechange`)
    ],    
    [
      'waiting',
      new Event(
        `Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).`,
        `https://developer.mozilla.org/en-US/docs/Web/Events/waiting`)
    ],                                                                                            
  ]);  
}

export class BaseElement {

  protected url: string;
  public hasGlobalAttributes = true;
  public hasGlobalEvents = true;

  public attributes: Map<string, BaseAttribute> = new Map<string, BaseAttribute>();
  public events: Map<string, Event> = new Map<string, Event>();
}

export class MozDocElement extends BaseElement {
  public get licenceText() {
    return `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;
  }

  public permittedChildren: Array<string> = [];
  public notPermittedChildren: Array<string> = [];
  public permittedParents: Array<string> = [];
  public emptyElement: boolean = false;

  public ariaRoles: Array<string> = [];
  public areaRolesAllowed: boolean = true;
}
