import { CustomElementCustomElement } from './custom-element';
import { OtherInterface } from './other-custom-element-user';

export class CustomElementUserCustomElement {
  @bindable fooUser;
  @bindable barUser;
  quxUser;
  userObject: OtherInterface;
}

CustomElementCustomElement;

/* prettier-ignore */
const aht = [
  // Id        , RegionType               , Code                                                 , Line  , File
  ['0ZDKeJDj'  ,'Attribute'               , '<div id.bind="bar"></div>'                          , '3'   , 'custom-element.html']             ,
  ['6tsdeuLO'  ,'AttributeInterpolation'  , '<div id="${foo}"></div>'                            , '2'   , 'custom-element.html']             ,
  ['sQzFHkpE'  ,'BindableAttribute'       , '....foo.bind=""'                                    , '4'   , 'other-custom-element-user.html']  ,
  ['LxGZT9zD'  ,'CustomElement'           , '..<custom-element'                                  , '3'   , 'other-custom-element-user.html']  ,
  ['ZPbFYwgH'  ,'RepeatFor'               , '<div repeat.for="fooElement of foo"></div>'         , '4'   , 'custom-element.html']             ,
  ['qgUywIU8'  ,'TextInterpolation'       , '${foo}'                                             , '1'   , 'custom-element.html']             ,
  ['GZpt3GQG'  ,'ValueConverter'          , '<p class="${useFoo(qux)}">${arr[qux] | hello}</p>'  , '6'   , 'custom-element.html']             ,
];
