# Definition

## General information
https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition

## How to trigger in VSCode
Shortcut: `F12`
Command: Go to Definition

## Feature list
Note: The `|` indicates your cursor position, where you trigger Defintions.

### Definition in View
Will go to definition in View model
- ```html
  <p id="${foo|}"></p>
  ```
- ```html
  <p id.bind="foo|"></p>
  ```
- ```html
  <p repeat.for="foo of |fooList"></p>
  ```
- ```html
  <custom-element|></custom-element>
  ```
- ```html
  <custom-element foo|.bind=""></custom-element>
  ```
  - Should land in View model following one of the conventions
    - .js and .html are named custom-element and
     ViewModel is named CustomElement (or CustomElementCustomElement)
    - Class has `@customElement` decorator
    - [Official docs on convention](https://docs.aurelia.io/getting-to-know-aurelia/components/creating-components#convention-less-components)
- ```html
  <import from="|./path/to/component"></import>
  ```
  - Should land in View model

### Definition in View model
- ```js
  class CustomElement| {}
  ```
  - Should show all view references, where `<custom-element>` is used
- ```js
  class CustomElement {
    @bindable foo|
  }
  ```
  - Should show all view references, where `<custom-element foo.bind>` is used

## Limitations
- HTML-only Custom Element not supported yet
- Router related views not supported. More specifically, you cannot find usage places of components, that are the "base" of a route. Still works for imported components inside route view.
- Access Members are not supported, eg `foo.|member` does not work. (Only works for "Access Scopes". `foo` would is the Access Scope in `foo.member` or `foo[0]` or `foo(arg)`. In the last case `foo` is th Call Scope, which is supported too.)

## Development

### Backlog
- Turn `<a href="xyz">` into `<require from="xyz">`
- Select code in view -> refactor into own component
