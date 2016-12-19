<a name="0.2.0"></a>
# [0.2.0](https://github.com/aurelia/vscode-extension/compare/0.1.12...v0.2.0) (2016-12-19)


### Features

* **vscode:** adopt SnippetString for auto complete (new feature in vscode 1.8.0) ([#28](https://github.com/aurelia/vscode-extension/issues/28)), resolves [#25](https://github.com/aurelia/vscode-extension/issues/25) ([a438cb5](https://github.com/aurelia/vscode-extension/commit/a438cb5))



<a name="0.1.12"></a>
## [0.1.12](https://github.com/aurelia/vscode-extension/compare/0.1.11...v0.1.12) (2016-12-15)


### Features

* **autocomplete:** Add capture to syntax highlighting for events ([#26](https://github.com/aurelia/vscode-extension/issues/26)) ([1ea4e13](https://github.com/aurelia/vscode-extension/commit/1ea4e13))



<a name="0.1.11"></a>
## [0.1.11](https://github.com/aurelia/vscode-extension/compare/0.1.10...v0.1.11) (2016-11-28)


### Bug Fixes

* **commands:** show warning when you run a Aurelia-CLI command in a non Aurelia-CLI project ([2eec465](https://github.com/aurelia/vscode-extension/commit/2eec465))


### Features

* **commands:** add au run --watch to command pallet ([672c5bd](https://github.com/aurelia/vscode-extension/commit/672c5bd))
* **commands:** add au run to command pallet ([#24](https://github.com/aurelia/vscode-extension/issues/24)) ([4d2efd8](https://github.com/aurelia/vscode-extension/commit/4d2efd8))
* **commands:** run commands in vscode terminal instead of seperate window ([6468338](https://github.com/aurelia/vscode-extension/commit/6468338))
* **vscode:** update minimal version to 1.7.1 to make use of new functionality ([c5ef0e1](https://github.com/aurelia/vscode-extension/commit/c5ef0e1))



<a name="0.1.10"></a>
## [0.1.10](https://github.com/aurelia/vscode-extension/compare/0.1.9...v0.1.10) (2016-11-07)


### Bug Fixes

* **syntax:** don't tokenize attribute body something.ref with aurelia ref, resolves: [#19](https://github.com/aurelia/vscode-extension/issues/19) ([43528bb](https://github.com/aurelia/vscode-extension/commit/43528bb))
* **theme:** update custom themes to match latest vscode 1.7.1 themes, resolves: [#20](https://github.com/aurelia/vscode-extension/issues/20) ([e5741f7](https://github.com/aurelia/vscode-extension/commit/e5741f7))


### Features

* **codefix:** codefix for diagnostics invalid casing ([#21](https://github.com/aurelia/vscode-extension/issues/21)) ([8d23232](https://github.com/aurelia/vscode-extension/commit/8d23232))
* **diagnostics:** adds invalid casing diagnostic ([#16](https://github.com/aurelia/vscode-extension/issues/16)) ([eee039c](https://github.com/aurelia/vscode-extension/commit/eee039c))
* **syntax:** tokenize/ syntax highlight matcher.bind ([9f9f1c4](https://github.com/aurelia/vscode-extension/commit/9f9f1c4))



<a name="0.1.9"></a>
## [0.1.9](https://github.com/aurelia/vscode-extension/compare/0.1.8...v0.1.9) (2016-10-25)


### Bug Fixes

* **autocomplete:** added focus attribute data bindings, resolves [#17](https://github.com/aurelia/vscode-extension/issues/17) ([51bb902](https://github.com/aurelia/vscode-extension/commit/51bb902))
* **autocomplete:** complete as-element without databindings, resolves [#14](https://github.com/aurelia/vscode-extension/issues/14) ([accbf0c](https://github.com/aurelia/vscode-extension/commit/accbf0c))


### Features

* **autocomplete:** config setting aurelia.autocomplete.quotes to specify single or double quotes on auto-complete, resolves [#13](https://github.com/aurelia/vscode-extension/issues/13) ([#15](https://github.com/aurelia/vscode-extension/issues/15)) ([e60b97d](https://github.com/aurelia/vscode-extension/commit/e60b97d))
* **syntax:** tokenize compile-spy ([b9fa63e](https://github.com/aurelia/vscode-extension/commit/b9fa63e))
* **syntax:** tokenize route-href ([77b6828](https://github.com/aurelia/vscode-extension/commit/77b6828))
* **syntax:** tokenize view-spy ([15f9fcd](https://github.com/aurelia/vscode-extension/commit/15f9fcd))



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




