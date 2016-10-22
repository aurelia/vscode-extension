<a name="0.1.8"></a>
## [0.1.8](https://github.com/aurelia/vscode-extension/compare/0.1.7...v0.1.8) (2016-10-22)


### Bug Fixes

* **autocomplete:** add auto complete to all elements of https://developer.mozilla.org/en-US/docs/Web/HTML/Element ([bf785cd](https://github.com/aurelia/vscode-extension/commit/bf785cd))
* **autocomplete:** only add form related events to the <form> element ([e152836](https://github.com/aurelia/vscode-extension/commit/e152836))
* **autocomplete:** use https://developer.mozilla.org/en-US/docs/Web/Events events and don't add delegate to non-bubling events, resolves [#12](https://github.com/aurelia/vscode-extension/issues/12) ([798ae66](https://github.com/aurelia/vscode-extension/commit/798ae66))



<a name="0.1.7"></a>
## [0.1.7](https://github.com/aurelia/vscode-extension/compare/0.1.6...v0.1.7) (2016-10-22)


### Bug Fixes

* **autocomplete:** implement language server with default auto completes resolves [#4](https://github.com/aurelia/vscode-extension/issues/4) [#7](https://github.com/aurelia/vscode-extension/issues/7)  ([#11](https://github.com/aurelia/vscode-extension/issues/11)) ([49656b5](https://github.com/aurelia/vscode-extension/commit/49656b5))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/aurelia/vscode-extension/compare/0.1.5...v0.1.6) (2016-10-13)


### Bug Fixes

* **syntax:** correctly tokenize if, show, view-model, repeat.for, binding, controller, data bindings, resolves [#6](https://github.com/aurelia/vscode-extension/issues/6) ([#8](https://github.com/aurelia/vscode-extension/issues/8)) ([2f10ee2](https://github.com/aurelia/vscode-extension/commit/2f10ee2))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/aurelia/vscode-extension/compare/0.1.4...v0.1.5) (2016-10-10)


### Bug Fixes

* **syntax:** don't tokenize word ref inside body of attributes, resolves [#5](https://github.com/aurelia/vscode-extension/issues/5) ([9849ce6](https://github.com/aurelia/vscode-extension/commit/9849ce6))
* **syntax:** tokenize attribute body correctly if it contains model keyword ([28dcf85](https://github.com/aurelia/vscode-extension/commit/28dcf85))
* **syntax:** tokenize attribute body correctly/ don't apply invoke rule on it ([1d51470](https://github.com/aurelia/vscode-extension/commit/1d51470))
* **syntax:** tokenize view attribute correctly ([52e4447](https://github.com/aurelia/vscode-extension/commit/52e4447))
* **test:** replace-part test should check for not containing replace-part instead of replaceable ([d67f5ad](https://github.com/aurelia/vscode-extension/commit/d67f5ad))


### Features

* **syntax:** tokenize as-element with as-element.attribute.html.au ([61db04d](https://github.com/aurelia/vscode-extension/commit/61db04d))
* **syntax:** tokenize replace-part with replace-part.attribute.html.au ([ffab125](https://github.com/aurelia/vscode-extension/commit/ffab125))
* **syntax:** tokenize replaceable attribute with replaceable.attribute.html.au ([6c67b2d](https://github.com/aurelia/vscode-extension/commit/6c67b2d))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/aurelia/vscode-extension/compare/0.0.0...0.1.4) (2016-10-02)


### Bug Fixes

* **vscode:** import statement file name of aureliaCLICommands is case sensitive on linux ([15d3b52](https://github.com/aurelia/vscode-extension/commit/15d3b52))


### Features

* **commands:** add new, generate, test, and build commands ([a4fcea9](https://github.com/aurelia/vscode-extension/commit/a4fcea9))
* **syntax:** grammer support for Aurelia attributes and elements ([68de504](https://github.com/aurelia/vscode-extension/commit/68de504))




