// import { TagSet, HTMLTagSpecification, HTMLAttributeSpecification, AttributeSet, EventSet } from './models';

// export const AURELIA_TAGS: TagSet = {
//   'router-view': new HTMLTagSpecification(`Placeholder for the router content`, [
//     new HTMLAttributeSpecification('name'),
//     new HTMLAttributeSpecification('layout-view', [], true, false),
//     new HTMLAttributeSpecification( 'layout-view-model', [], true, false),
//     new HTMLAttributeSpecification('layout-model', [], true, false)]),
//   'compose': new HTMLTagSpecification(`Composes the view in the current position`, [
//     new HTMLAttributeSpecification('view', [], true, false)]),
//   'slot': new HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
//     new HTMLAttributeSpecification('name'),
//     new HTMLAttributeSpecification('slot')]),
// };

// const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];

// export const AURELIA_ATTRIBUTES: AttributeSet = {
//     'select'  : [ new HTMLAttributeSpecification('matcher', defaultBindings, true, false) ],
//     'option'  : [ new HTMLAttributeSpecification('model', defaultBindings, true, false) ],
//     'input'   : [
//       new HTMLAttributeSpecification('value', defaultBindings, true, true),
//       new HTMLAttributeSpecification('checked', defaultBindings, true, true),
//       new HTMLAttributeSpecification('model', defaultBindings, true, false),
//     ],
//     'compose' : [
//       new HTMLAttributeSpecification('view', defaultBindings, true, false),
//       new HTMLAttributeSpecification('view-model', defaultBindings, true, false),
//       new HTMLAttributeSpecification('model', defaultBindings, true, false),
//     ],
//     'template': [
//       new HTMLAttributeSpecification('replaceable', [], false, false),
//       new HTMLAttributeSpecification('replace-part', defaultBindings, true, false),
//       new HTMLAttributeSpecification('bindable', defaultBindings, true, false),
//       new HTMLAttributeSpecification('containerless', [], false, false),
//     ],
//     'a': [ new HTMLAttributeSpecification('route-href', defaultBindings, true, false)],
//     'slot': [ new HTMLAttributeSpecification('name', defaultBindings, true, true) ],
// };

// export const AURELIA_GLOBAL_ATTRIBUTES: Array<HTMLAttributeSpecification> = [
//   new HTMLAttributeSpecification('repeat.for', [], true, false),
//   new HTMLAttributeSpecification('as-element', [], true, false),
//   new HTMLAttributeSpecification('view', defaultBindings, true, false),
//   new HTMLAttributeSpecification('ref', [], true, false),
//   new HTMLAttributeSpecification('element.ref', [], true, false),
//   new HTMLAttributeSpecification('view-model.ref', [], true, false),
//   new HTMLAttributeSpecification('view.ref', [], true, false),
//   new HTMLAttributeSpecification('controller.ref', [], true, false),
//   new HTMLAttributeSpecification('innerhtml', defaultBindings, true, false),
//   new HTMLAttributeSpecification('textcontent', defaultBindings, true, false),
//   new HTMLAttributeSpecification('style', defaultBindings, true, true),
//   new HTMLAttributeSpecification('show', defaultBindings, true, false),
//   new HTMLAttributeSpecification('if', defaultBindings, true, false),
//   new HTMLAttributeSpecification('naive-if', defaultBindings, true, false),
//   new HTMLAttributeSpecification('with', defaultBindings, true, false),
//   new HTMLAttributeSpecification('slot', [], true, false),
//   new HTMLAttributeSpecification('view-spy', [], true, false),
//   new HTMLAttributeSpecification('compile-spy', [], true, false),
// ];

// const actionRedirectOptions = ['capture', 'delegate', 'trigger', 'call'];
// const actionRedirectOptionsNonBubbling = ['capture', 'trigger', 'call'];

// const globalEvents = [

//     // Resource Events
//     new HTMLAttributeSpecification('error', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('abort', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('load', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('unload', actionRedirectOptionsNonBubbling),

//     // Focus Events
//     new HTMLAttributeSpecification('blur', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('focus', ['call', 'capture', 'trigger', 'bind', 'one-way', 'two-way', 'one-time']),

//     // CSS Animation Events
//     new HTMLAttributeSpecification('animationstart', actionRedirectOptions),
//     new HTMLAttributeSpecification('animationend', actionRedirectOptions),
//     new HTMLAttributeSpecification('animationiteration', actionRedirectOptions),

//     // Text Composition Events
//     new HTMLAttributeSpecification('compositionstart', actionRedirectOptions),
//     new HTMLAttributeSpecification('compositionupdate', actionRedirectOptions),
//     new HTMLAttributeSpecification('compositionend', actionRedirectOptions),

//     // View Events
//     new HTMLAttributeSpecification('scroll', actionRedirectOptionsNonBubbling),

//     // Clipboard Events
//     new HTMLAttributeSpecification('cut', actionRedirectOptions),
//     new HTMLAttributeSpecification('copy', actionRedirectOptions),
//     new HTMLAttributeSpecification('paste', actionRedirectOptions),

//     // Keyboard Events
//     new HTMLAttributeSpecification('keydown', actionRedirectOptions),
//     new HTMLAttributeSpecification('keypress', actionRedirectOptions),
//     new HTMLAttributeSpecification('keyup', actionRedirectOptions),

//     // Mouse Events
//     new HTMLAttributeSpecification('mouseenter', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('mouseover', actionRedirectOptions),
//     new HTMLAttributeSpecification('mousemove', actionRedirectOptions),
//     new HTMLAttributeSpecification('mousedown', actionRedirectOptions),
//     new HTMLAttributeSpecification('mouseup', actionRedirectOptions),
//     new HTMLAttributeSpecification('mouseout', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('click', actionRedirectOptions),
//     new HTMLAttributeSpecification('dblclick', actionRedirectOptions),
//     new HTMLAttributeSpecification('contextmenu', actionRedirectOptions),
//     new HTMLAttributeSpecification('wheel', actionRedirectOptions),
//     new HTMLAttributeSpecification('mouseleave', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('mouseout', actionRedirectOptions),
//     new HTMLAttributeSpecification('select', actionRedirectOptionsNonBubbling),
//     new HTMLAttributeSpecification('pointerlockchange', actionRedirectOptions),
//     new HTMLAttributeSpecification('pointerlockerror', actionRedirectOptions),

//     // Drag & Drop Events
//     new HTMLAttributeSpecification('dragstart', actionRedirectOptions),
//     new HTMLAttributeSpecification('drag', actionRedirectOptions),
//     new HTMLAttributeSpecification('dragend', actionRedirectOptions),
//     new HTMLAttributeSpecification('dragenter', actionRedirectOptions),
//     new HTMLAttributeSpecification('dragover', actionRedirectOptions),
//     new HTMLAttributeSpecification('dragleave', actionRedirectOptions),
//     new HTMLAttributeSpecification('drop', actionRedirectOptions),

//     // Touch events
//     new HTMLAttributeSpecification('touchstart', actionRedirectOptions),
//     new HTMLAttributeSpecification('touchmove', actionRedirectOptions),
//     new HTMLAttributeSpecification('touchend', actionRedirectOptions),

//     // Other
//     new HTMLAttributeSpecification('close', actionRedirectOptions),
// ];

// export const AURELIA_EVENTS: EventSet = {
//   'a': globalEvents,
//   'abbr': globalEvents,
//   'address': globalEvents,
//   'area': globalEvents,
//   'article': globalEvents,
//   'aside': globalEvents,
//   'audio': globalEvents,
//   'b': globalEvents,
//   'base': globalEvents,
//   'bdi': globalEvents,
//   'bdo': globalEvents,
//   'blockquote': globalEvents,
//   'body': globalEvents,
//   'br': globalEvents,
//   'button': globalEvents,
//   'canvas': globalEvents,
//   'caption': globalEvents,
//   'cite': globalEvents,
//   'code': globalEvents,
//   'col': globalEvents,
//   'colgroup': globalEvents,
//   'data': globalEvents,
//   'datalist': globalEvents,
//   'dd': globalEvents,
//   'del': globalEvents,
//   'details': globalEvents,
//   'dfn': globalEvents,
//   'div': globalEvents,
//   'dl': globalEvents,
//   'dt': globalEvents,
//   'em': globalEvents,
//   'embed': globalEvents,
//   'fieldset': globalEvents,
//   'figcaption': globalEvents,
//   'figure': globalEvents,
//   'footer': globalEvents,
//   'form': [
//     ...globalEvents,
//     new HTMLAttributeSpecification('reset', actionRedirectOptions),
//     new HTMLAttributeSpecification('submit', actionRedirectOptions),
//     new HTMLAttributeSpecification('change', actionRedirectOptions),
//     new HTMLAttributeSpecification('input', actionRedirectOptions),
//   ],
//   'header': globalEvents,
//   'hr': globalEvents,
//   'i': globalEvents,
//   'iframe': globalEvents,
//   'img': globalEvents,
//   'input': globalEvents,
//   'ins': globalEvents,
//   'kbd': globalEvents,
//   'label': globalEvents,
//   'legend': globalEvents,
//   'li': globalEvents,
//   'link': globalEvents,
//   'main': globalEvents,
//   'map': globalEvents,
//   'mark': globalEvents,
//   'meter': globalEvents,
//   'nav': globalEvents,
//   'object': globalEvents,
//   'ol': globalEvents,
//   'optgroup': globalEvents,
//   'option': globalEvents,
//   'output': globalEvents,
//   'p': [...globalEvents],
//   'param': [...globalEvents],
//   'pre': [...globalEvents],
//   'progress': [...globalEvents],
//   'q': globalEvents,
//   'rp': globalEvents,
//   'rt': globalEvents,
//   'rtc': globalEvents,
//   'ruby': globalEvents,
//   's': globalEvents,
//   'samp': globalEvents,
//   'section': globalEvents,
//   'select': globalEvents,
//   'shadow': globalEvents,
//   'small': globalEvents,
//   'source': globalEvents,
//   'span': globalEvents,
//   'strong': globalEvents,
//   'sub': globalEvents,
//   'summary': globalEvents,
//   'sup': globalEvents,
//   'table': globalEvents,
//   'tbody': globalEvents,
//   'td': globalEvents,
//   'template': globalEvents,
//   'textarea': globalEvents,
//   'tfoot': globalEvents,
//   'th': globalEvents,
//   'thead': globalEvents,
//   'time': globalEvents,
//   'title': globalEvents,
//   'tr': globalEvents,
//   'track': globalEvents,
//   'u': globalEvents,
//   'ul': globalEvents,
//   'var': globalEvents,
//   'video': globalEvents,
//   'wbr': globalEvents,
// };
