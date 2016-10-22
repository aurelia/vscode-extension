import { ITagSet, HTMLTagSpecification, HTMLAttributeSpecification, IAttributeSet, IEventSet } from './models';

export const AURELIA_TAGS: ITagSet = {
  'require' : new HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, [
    new HTMLAttributeSpecification('from', [], true, false), 
    new HTMLAttributeSpecification('as', [], true, false) ]),
  'router-view': new HTMLTagSpecification(`Placeholder for the router content`, [
    new HTMLAttributeSpecification('name'), 
    new HTMLAttributeSpecification('layout-view', [], true, false),
    new HTMLAttributeSpecification( 'layout-view-model', [], true, false),
    new HTMLAttributeSpecification('layout-model', [], true, false)]),
  'compose': new HTMLTagSpecification(`Composes the view in the current position`, [
    new HTMLAttributeSpecification('view', [], true, false)]),
  'slot': new HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
    new HTMLAttributeSpecification('name'),
    new HTMLAttributeSpecification('slot')])
};

const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];

export const AURELIA_ATTRIBUTES: IAttributeSet = {
    'select'  : [ new HTMLAttributeSpecification('matcher', defaultBindings, true, false) ],
    'option'  : [ new HTMLAttributeSpecification('model', defaultBindings, true, false) ],
    'input'   : [
      new HTMLAttributeSpecification('value', defaultBindings), 
      new HTMLAttributeSpecification('checked' ,defaultBindings),
      new HTMLAttributeSpecification('model', defaultBindings, true, false)
    ],
    'compose' : [
      new HTMLAttributeSpecification('view', defaultBindings, true, false),
      new HTMLAttributeSpecification('view-model', defaultBindings, true, false),
      new HTMLAttributeSpecification('model', defaultBindings, true, false)
    ],
    'template': [
      new HTMLAttributeSpecification('replaceable', [], false),
      new HTMLAttributeSpecification('replace-part', defaultBindings, true, false),
      new HTMLAttributeSpecification('bindable', defaultBindings, true, false)
    ],
    'a': [ new HTMLAttributeSpecification('route-href', defaultBindings, true, false)],
    'slot': [ new HTMLAttributeSpecification('name', defaultBindings) ]
}

export const AURELIA_GLOBAL_ATTRIBUTES: Array<HTMLAttributeSpecification> = [
  new HTMLAttributeSpecification('repeat.for'),
  new HTMLAttributeSpecification('as-element', defaultBindings),
  new HTMLAttributeSpecification('view', defaultBindings, true, false),
  new HTMLAttributeSpecification('ref'),
  new HTMLAttributeSpecification('element.ref'),
  new HTMLAttributeSpecification('view-model.ref'),
  new HTMLAttributeSpecification('view.ref'),
  new HTMLAttributeSpecification('controller.ref'),
  new HTMLAttributeSpecification('innerhtml', defaultBindings, true, false),
  new HTMLAttributeSpecification('textcontent', defaultBindings, true, false),
  new HTMLAttributeSpecification('style', defaultBindings),
  new HTMLAttributeSpecification('show', defaultBindings, true, false),
  new HTMLAttributeSpecification('if', defaultBindings, true, false),
  new HTMLAttributeSpecification('naive-if', defaultBindings, true, false),
  new HTMLAttributeSpecification('with', defaultBindings),
  new HTMLAttributeSpecification('slot'),
  new HTMLAttributeSpecification('containerless', [], true),
  new HTMLAttributeSpecification('view-spy', [], true),
  new HTMLAttributeSpecification('compile-spy', [], true),
];

const actionRedirectOptions = ['delegate', 'trigger', 'call'];
const actionRedirectOptionsNonBubbling = ['trigger', 'call'];

const globalEvents = [

    // Resource Events
    new HTMLAttributeSpecification('error', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('abort', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('load', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('unload', actionRedirectOptionsNonBubbling),
    
    // Focus Events
    new HTMLAttributeSpecification('blur', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('focus', actionRedirectOptionsNonBubbling),
    
    // CSS Animation Events
    new HTMLAttributeSpecification('animationstart', actionRedirectOptions),
    new HTMLAttributeSpecification('animationend', actionRedirectOptions),
    new HTMLAttributeSpecification('animationiteration', actionRedirectOptions),

    // Text Composition Events
    new HTMLAttributeSpecification('compositionstart', actionRedirectOptions),
    new HTMLAttributeSpecification('compositionupdate', actionRedirectOptions),
    new HTMLAttributeSpecification('compositionend', actionRedirectOptions),

    // View Events
    new HTMLAttributeSpecification('scroll', actionRedirectOptionsNonBubbling),

    // Clipboard Events
    new HTMLAttributeSpecification('cut', actionRedirectOptions),
    new HTMLAttributeSpecification('copy', actionRedirectOptions),
    new HTMLAttributeSpecification('paste', actionRedirectOptions),

    // Keyboard Events
    new HTMLAttributeSpecification('keydown', actionRedirectOptions),
    new HTMLAttributeSpecification('keypress', actionRedirectOptions),
    new HTMLAttributeSpecification('keyup', actionRedirectOptions),    

    // Mouse Events
    new HTMLAttributeSpecification('mouseenter', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('mouseover', actionRedirectOptions),
    new HTMLAttributeSpecification('mousemove', actionRedirectOptions),
    new HTMLAttributeSpecification('mousedown', actionRedirectOptions),
    new HTMLAttributeSpecification('mouseup', actionRedirectOptions),
    new HTMLAttributeSpecification('mouseout', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('click', actionRedirectOptions),
    new HTMLAttributeSpecification('dblclick', actionRedirectOptions),
    new HTMLAttributeSpecification('contextmenu', actionRedirectOptions),
    new HTMLAttributeSpecification('wheel', actionRedirectOptions),
    new HTMLAttributeSpecification('mouseleave', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('mouseout', actionRedirectOptions),
    new HTMLAttributeSpecification('select', actionRedirectOptionsNonBubbling),
    new HTMLAttributeSpecification('pointerlockchange', actionRedirectOptions),
    new HTMLAttributeSpecification('pointerlockerror', actionRedirectOptions),

    // Drag & Drop Events
    new HTMLAttributeSpecification('dragstart', actionRedirectOptions),
    new HTMLAttributeSpecification('drag', actionRedirectOptions),
    new HTMLAttributeSpecification('dragend', actionRedirectOptions),
    new HTMLAttributeSpecification('dragenter', actionRedirectOptions),
    new HTMLAttributeSpecification('dragover', actionRedirectOptions),
    new HTMLAttributeSpecification('dragleave', actionRedirectOptions),
    new HTMLAttributeSpecification('drop', actionRedirectOptions),

    // Touch events
    new HTMLAttributeSpecification('touchstart', actionRedirectOptions),
    new HTMLAttributeSpecification('touchmove', actionRedirectOptions),
    new HTMLAttributeSpecification('touchend', actionRedirectOptions),

    // Other
    new HTMLAttributeSpecification('close', actionRedirectOptions),
];

export const AURELIA_EVENTS: IEventSet = {
  'form': [
    ...globalEvents,
    new HTMLAttributeSpecification('reset', actionRedirectOptions),
    new HTMLAttributeSpecification('submit', actionRedirectOptions),
    new HTMLAttributeSpecification('change', actionRedirectOptions),
    new HTMLAttributeSpecification('input', actionRedirectOptions),    
  ],
  'input': [...globalEvents],
  'textarea': [...globalEvents],
  'select': [...globalEvents],
  'div': [...globalEvents],
  'p': [...globalEvents],
  'span': [...globalEvents],
  'ul': [...globalEvents],
  'ol': [...globalEvents], 
  'li': [...globalEvents]
}
