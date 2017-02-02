export class Value {
  constructor(public documentation: string = '') {
    
  }
}

export class Attribute {
  constructor(
    public documentation: string, 
    public customSnippet: string = null,
    public customBindingSnippet: string = null,
    public customLabel: string = null,
    public values: Map<string, Value> = new Map()) { }
}

export class Event {
  constructor(
    public documentation: string,
    public url: string,
    public bubbles: boolean = false,
    public cancelable: boolean = false
  ) { }
}

export class GlobalAttributes {
  public static attributes: Map<string, Attribute> = new Map<string, Attribute>([
      [
        'accesskey',
        new Attribute(`Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout.`)
      ],
      [
        'class',
        new Attribute(`Is a space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().`)
      ],
      [
        'contenteditable',
        new Attribute(`Is an enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing.`,
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
        new Attribute(`Is the id of an <menu> (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu) to use as the contextual menu for this element.`)
      ],  
      [
        'data-*',
        new Attribute(`Forms a class of attributes, called custom data attributes, that allow proprietary information to be exchanged between the HTML and its DOM representation that may be used by scripts. All such custom data are available via the HTMLElement interface of the element the attribute is set on. The HTMLElement.dataset property gives access to them.`, 'data-$1="$0"', 'data-$1.bind="$0"')
      ],
      ['dir', 
        new Attribute(`Is an enumerated attribute indicating the directionality of the element's text.`, 
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
        new Attribute(`Is a Boolean attribute indicates that the element is not yet, or is no longer, relevant. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown.`)
      ],              
      [
        'id',
        new Attribute(`Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).`)
      ],  
      [
        'lang',
        new Attribute(`Participates in defining the language of the element, the language that non-editable elements are written in or the language that editable elements should be written in. The tag contains one single entry value in the format defines in the Tags for Identifying Languages (BCP47) IETF document. xml:lang has priority over it.`)
      ],        

      [
        'slot',
        new Attribute(`Assigns a slot in a shadow DOM shadow tree to an element: An element with a slot attribute is assigned to the slot created by the <slot> element whose name attribute's value matches that slot attribute's value.`)
      ],        
      [
        'style',
        new Attribute(`Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the <style> element have mainly the purpose of allowing for quick styling, for example for testing purposes.`)
      ],        
      [
        'tabindex',
        new Attribute(`Is an integer attribute indicates if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position.`)
      ], 
      [
        'title',
        new Attribute(`Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip.`)
      ], 
      [
        'translate',
        new Attribute(`Is an enumerated attribute that is used to specify whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged`,
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
        new Attribute(
          `repeat over a set, map, or array`,
          'no-snippet',
          `repeat.for="$1 of $0"`,
          `repeat.for`)
          //http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-basics/9
      ],
      [
        'as-element',
        new Attribute(
          `In some cases, especially when creating table rows out of Aurelia custom elements, you may need to have a custom element masquerade as a standard HTML element. For example, if you're trying to fill table rows with data, you may need your custom element to appear as a <tr> row or <td> cell. This is where the as-element attribute comes in handy`)
          //http://aurelia.io/hub.html#/doc/article/aurelia/templating/latest/templating-basics/5
      ],
      [
        'view',
        new Attribute(``)
      ],
      [
        'ref',
        new Attribute(``)
      ],
      [
        'element.ref',
        new Attribute(``)
      ],
      [
        'view-model.ref',
        new Attribute(``)
      ],
      [
        'view.ref',
        new Attribute(``)
      ],            
      [
        'controller.ref',
        new Attribute(``)
      ], 
      [
        'innerhtml',
        new Attribute(``,
        'no-snippet')
      ], 
      [
        'textcontent',
        new Attribute(``,
        'no-snippet')
      ],
      [
        'show',
        new Attribute(``,
        'no-snippet')
      ],
      [
        'if',
        new Attribute(``,
        'no-snippet')
      ],
      [
        'naive-if',
        new Attribute(``,
        'no-snippet')
      ],                  
      [
        'with',
        new Attribute(``)
      ],        
      [
        'view-spy',
        new Attribute(``,
        'no-snippet',
        'view-spy',
        'view-spy')
      ], 
      [
        'compile-spy',
        new Attribute(``,
        'no-snippet',
        'compile-spy',
        'compile-spy')
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
}
