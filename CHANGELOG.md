<a name="1.0.3"></a>
## [1.0.3](https://github.com/aurelia/vscode-extension/compare/1.0.2...1.0.3) (2018-02-28)


### Bug Fixes

* **syntax:** implement fix from darthInvad0r for string interpolation, resolves [#79](https://github.com/aurelia/vscode-extension/issues/79) ([#83](https://github.com/aurelia/vscode-extension/issues/83)) ([9d7017f](https://github.com/aurelia/vscode-extension/commit/9d7017f))


### Features

* **syntax:** upgrade html syntax to latest and support .au files ([#82](https://github.com/aurelia/vscode-extension/issues/82)) ([b1884f7](https://github.com/aurelia/vscode-extension/commit/b1884f7))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/aurelia/vscode-extension/compare/1.0.1...1.0.2) (2018-02-26)


### Bug Fixes

* **smart-autocomplete:** don't fail on undefined location for attribute, resolves [#74](https://github.com/aurelia/vscode-extension/issues/74) ([#75](https://github.com/aurelia/vscode-extension/issues/75)) ([ac71258](https://github.com/aurelia/vscode-extension/commit/ac71258))
* **syntax:** string interpolation regex crashed when holding spacebar ([#81](https://github.com/aurelia/vscode-extension/issues/81)) ([e864c5e](https://github.com/aurelia/vscode-extension/commit/e864c5e))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/aurelia/vscode-extension/compare/1.0.0...1.0.1) (2018-01-27)


### Bug Fixes

* **dependencies:** move Typescript from devDependencies to Dependencies ([f68830b](https://github.com/aurelia/vscode-extension/commit/f68830b))
* **diagnostics:** suggest lowercase variant, not the JavaScript name for items in attributeMap, resolves [#72](https://github.com/aurelia/vscode-extension/issues/72) ([#73](https://github.com/aurelia/vscode-extension/issues/73)) ([cfd831f](https://github.com/aurelia/vscode-extension/commit/cfd831f))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/vscode-extension/compare/0.3.4...1.0.0) (2018-01-23)


### Bug Fixes

* **auto-complete:** suggest with as with.bind ([ea625e1](https://github.com/aurelia/vscode-extension/commit/ea625e1))
* **codefix:** use the Aurelia attribute map to validate case of attributes, resolves [#54](https://github.com/aurelia/vscode-extension/issues/54) ([b143ce8](https://github.com/aurelia/vscode-extension/commit/b143ce8))
* **related-file:** add editor column index when opening related file ([#57](https://github.com/aurelia/vscode-extension/issues/57)) ([70875d2](https://github.com/aurelia/vscode-extension/commit/70875d2)), closes [#51](https://github.com/aurelia/vscode-extension/issues/51)
* **syntax:** tokenize string interpolation end character correctly, fixes [#48](https://github.com/aurelia/vscode-extension/issues/48) ([0921158](https://github.com/aurelia/vscode-extension/commit/0921158))
* **themes:** add scope for let element ([#63](https://github.com/aurelia/vscode-extension/issues/63)) ([057cdfc](https://github.com/aurelia/vscode-extension/commit/057cdfc))


### Features

* **auto-complete:** data binding auto complete configuration option, resolves [#53](https://github.com/aurelia/vscode-extension/issues/53) ([#64](https://github.com/aurelia/vscode-extension/issues/64)) ([06815bd](https://github.com/aurelia/vscode-extension/commit/06815bd))
* **auto-complete:** experimental auto complete from view model (behind feature toggle: smartAutocomplete) ([7312b03](https://github.com/aurelia/vscode-extension/commit/7312b03))
* **diagnostics:** code action & diagnostic warning to convert 'one-way' to 'to-view' ([#66](https://github.com/aurelia/vscode-extension/issues/66)) ([2eb4ee1](https://github.com/aurelia/vscode-extension/commit/2eb4ee1))
* **syntax-highlight:** Add the let command, resolves [#55](https://github.com/aurelia/vscode-extension/issues/55) ([#60](https://github.com/aurelia/vscode-extension/issues/60)) ([5bcdfce](https://github.com/aurelia/vscode-extension/commit/5bcdfce))
* **vscode:** update vscode engine version and packages to latest ([8caa55b](https://github.com/aurelia/vscode-extension/commit/8caa55b))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/aurelia/vscode-extension/compare/0.3.3...v0.3.4) (2017-05-29)


### Bug Fixes

* **auto-complete:** add submit event auto complete to form element ([b03ecd2](https://github.com/aurelia/vscode-extension/commit/b03ecd2))
* **auto-complete:** don't auto-complete attibutes inside attribute value ([093a36a](https://github.com/aurelia/vscode-extension/commit/093a36a))
* **auto-complete:** don't auto-complete bindings on wrong spots ([e650d0d](https://github.com/aurelia/vscode-extension/commit/e650d0d))
* **auto-complete:** ignore elements that are currently not registered, resolves [#47](https://github.com/aurelia/vscode-extension/issues/47) ([d5e8002](https://github.com/aurelia/vscode-extension/commit/d5e8002))
* **auto-complete:** use auto-complete from HTML language for closing tag ([180773e](https://github.com/aurelia/vscode-extension/commit/180773e))
* **html-validation:** don't do anything on empty documents, resolves [#46](https://github.com/aurelia/vscode-extension/issues/46) ([40c2c23](https://github.com/aurelia/vscode-extension/commit/40c2c23))


### Features

* **dependencies:** update vscode-language(client/server/server-types) and aurelia-cli ([198dd1f](https://github.com/aurelia/vscode-extension/commit/198dd1f))
* **syntax:** tokenize capture event binding ([2662c01](https://github.com/aurelia/vscode-extension/commit/2662c01))
* **vscode:** update vscode version to 1.12.1 ([559f3c2](https://github.com/aurelia/vscode-extension/commit/559f3c2))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/aurelia/vscode-extension/compare/0.3.2...v0.3.3) (2017-05-04)


### Bug Fixes

* **language:** set custom language back to override html and disable custom hover, resolves [#45](https://github.com/aurelia/vscode-extension/issues/45) ([4048c8d](https://github.com/aurelia/vscode-extension/commit/4048c8d))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/aurelia/vscode-extension/compare/0.3.1...v0.3.2) (2017-04-26)


### Bug Fixes

* **emmet-autocomplete:** remove unneeded logging to aurelia output ([1635b29](https://github.com/aurelia/vscode-extension/commit/1635b29))
* **hover:** don't try to show hover information on unknown items ([c547f5f](https://github.com/aurelia/vscode-extension/commit/c547f5f))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/aurelia/vscode-extension/compare/0.3.0...v0.3.1) (2017-04-25)


### Features

* **deps:** update to aurelia-cli 0.28.0 ([aaa61c4](https://github.com/aurelia/vscode-extension/commit/aaa61c4))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/aurelia/vscode-extension/compare/0.2.7...v0.3.0) (2017-04-24)


### Bug Fixes

* **syntax:** correctly tokenize any elements with dash, resolves [#41](https://github.com/aurelia/vscode-extension/issues/41) ([db6fc47](https://github.com/aurelia/vscode-extension/commit/db6fc47))


### Features

* **language-server:** rebuild language server to enable better auto complete and prepare it for future improvements ([87caa9b](https://github.com/aurelia/vscode-extension/commit/87caa9b))



<a name="0.2.7"></a>
## [0.2.7](https://github.com/aurelia/vscode-extension/compare/0.2.6...v0.2.7) (2017-02-21)


### Features

* **command:** adds open related file command ([#38](https://github.com/aurelia/vscode-extension/issues/38)) ([7290e2e](https://github.com/aurelia/vscode-extension/commit/7290e2e)), closes [#29](https://github.com/aurelia/vscode-extension/issues/29)



<a name="0.2.6"></a>
## [0.2.6](https://github.com/aurelia/vscode-extension/compare/0.2.5...v0.2.6) (2017-02-15)


### Bug Fixes

* **auto-complete:** replace text instead of inserting snippet only, resolves [#37](https://github.com/aurelia/vscode-extension/issues/37) ([e81e515](https://github.com/aurelia/vscode-extension/commit/e81e515))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/aurelia/vscode-extension/compare/0.2.4...v0.2.5) (2017-02-15)


### Bug Fixes

* **themes:** update to latest styles of vscode, resolves [#34](https://github.com/aurelia/vscode-extension/issues/34) ([994c411](https://github.com/aurelia/vscode-extension/commit/994c411))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/aurelia/vscode-extension/compare/0.2.3...v0.2.4) (2017-02-08)


### Bug Fixes

* **highlight:** containerless, compile-spy, and view-spy regex add foward lookahead for ' ' or '>', resolves [#35](https://github.com/aurelia/vscode-extension/issues/35) ([8735a7a](https://github.com/aurelia/vscode-extension/commit/8735a7a))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/aurelia/vscode-extension/compare/0.2.2...v0.2.3) (2017-02-03)


### Bug Fixes

* **commands:** change to current directory before executing new command ([0c566e7](https://github.com/aurelia/vscode-extension/commit/0c566e7))
* **themes:** update dark plus theme to color css scopes, resolves [#34](https://github.com/aurelia/vscode-extension/issues/34) ([a10ac53](https://github.com/aurelia/vscode-extension/commit/a10ac53))


### Features

* **themes:** add solarized dark & light themes with Aurelia syntax, resolves [#33](https://github.com/aurelia/vscode-extension/issues/33) ([0f1c7b2](https://github.com/aurelia/vscode-extension/commit/0f1c7b2))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/aurelia/vscode-extension/compare/0.2.1...v0.2.2) (2017-02-02)


### Bug Fixes

* **readme:** remove outdated screenshot ([1267382](https://github.com/aurelia/vscode-extension/commit/1267382))
* **themes:** scopes won't auto inherit anymore in 1.9.0, defined all au scopes seperatly ([22d308a](https://github.com/aurelia/vscode-extension/commit/22d308a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/aurelia/vscode-extension/compare/0.2.0...v0.2.1) (2017-02-02)


### Bug Fixes

* **dependencies:** updated vscode-languageclient, vscode-languageserver. vscode-languageserver-types ([3794414](https://github.com/aurelia/vscode-extension/commit/3794414))
* **theme:** adjust dark theme to new settings in vscode 1.9 ([691610f](https://github.com/aurelia/vscode-extension/commit/691610f))
* **theme:** adjust light theme to new settings in vscode 1.9 ([f4cd0f4](https://github.com/aurelia/vscode-extension/commit/f4cd0f4))


### Features

* **vscode:** SnippetString was removed and API changed to InsertTextFormat.Snippet ([4ee1599](https://github.com/aurelia/vscode-extension/commit/4ee1599))



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




