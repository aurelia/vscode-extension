# Rename

## ⚠️ Warning ⚠️
**TLDR**: Feature may be unstable, use at own risk.

When triggering Rename, a lot of places can potentially change, thus making it hard to verify, if the changes were correct.
Thus, it is *highly* recommended, to eg. commit all the current changes, or any other means, that allow your diff view to just see changes from the Rename operation.
*(Imo, that's generally true for all kinds of Renames, not only specific to Aurelia.)*
The Extension tries to catch all th relevant places for Renaming, but due to the low iteration count of this feature, we unfortunately cannot ensure, that really *all* places changed, which can lead to a faulty application.
We are really sorry for the inconvenience, but still believe, that *if* you have to rename, this feature can at least some amount of work.


## General information
https://code.visualstudio.com/docs/editor/editingevolved#_rename-symbol

### How to trigger in VSCode
Shortcut: `F2`
Command: Rename Symbol

## Usage inside the Aurelia extension

## Feature list
Note: The `|` indicates your cursor position, where you trigger Rename.

### Rename in View
Will rename variables in View model. For Custom Elements and Bindables will also rename in other components.
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

### Rename in View model
- ```js
  class CustomElement| {}
  ```
  - Should rename all places in all Views, where `<custom-element>` is used
- ```js
  class CustomElement {
    @bindable foo|
  }
  ```
  - Should rename all places in all Views, where `<custom-element foo.bind>` is used

### Limitations
- HTML-only Custom Element not supported yet
- Router related views not supported. More specifically, you cannot find usage places of components, that are the "base" of a route. Still works for imported components inside route view.

## Development

### Backlog
