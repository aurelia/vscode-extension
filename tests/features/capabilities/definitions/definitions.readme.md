
## Definition
https://code.visualstudio.com/docs/editor/refactoring
Aka: Refactoring, Quick Fix

## How to trigger in VSCode
Shortcut: `F12`
Command: Go to Definition

## Usage inside the Aurelia extension

### Feature list
Note: The `|` indicates your cursor position, where you trigger Defintions.

#### Definition in View
Will go to definition in View model
- ```html
  <p id="${foo|}"></p>
  ```
- ```html
  <p id.bind="foo|"></p>
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
- ```html
  <import foo|.bind=""></import>
  ```
  - Should land in definition of Bindable in corresponding Custom Element class.

#### Definition in View model
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

### Limitations
- HTML-only Custom Element not supported yet
- Router views not supported


### Backlog
- Turn `<a href="xyz">` into `<require from="xyz">`
- Select code in view -> refactor into own component
