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

const globalEvents = [
    new HTMLAttributeSpecification('abort', defaultBindings),
    new HTMLAttributeSpecification('blur', defaultBindings),
    new HTMLAttributeSpecification('change', defaultBindings),
    new HTMLAttributeSpecification('click', defaultBindings),
    new HTMLAttributeSpecification('close', defaultBindings),
    new HTMLAttributeSpecification('contextmenu', defaultBindings),
    new HTMLAttributeSpecification('dblclick', defaultBindings),
    new HTMLAttributeSpecification('error', defaultBindings),
    new HTMLAttributeSpecification('focus', defaultBindings),
    new HTMLAttributeSpecification('input', defaultBindings),
    new HTMLAttributeSpecification('keydown', defaultBindings),
    new HTMLAttributeSpecification('keypress', defaultBindings),
    new HTMLAttributeSpecification('keyup', defaultBindings),    
    new HTMLAttributeSpecification('load', defaultBindings),
    new HTMLAttributeSpecification('mousedown', defaultBindings),
    new HTMLAttributeSpecification('mousemove', defaultBindings),
    new HTMLAttributeSpecification('mouseout', defaultBindings),
    new HTMLAttributeSpecification('mouseover', defaultBindings),
    new HTMLAttributeSpecification('mouseup', defaultBindings),
    new HTMLAttributeSpecification('reset', defaultBindings),
    new HTMLAttributeSpecification('resize', defaultBindings),
    new HTMLAttributeSpecification('scroll', defaultBindings),
    new HTMLAttributeSpecification('select', defaultBindings),
    new HTMLAttributeSpecification('submit', defaultBindings),
];

export const AURELIA_EVENTS: IEventSet = {
  'form': [
    ...globalEvents,
    new HTMLAttributeSpecification('submit', actionRedirectOptions),
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
