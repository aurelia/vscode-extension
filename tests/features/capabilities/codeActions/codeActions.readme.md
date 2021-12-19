
## Definition
https://code.visualstudio.com/docs/editor/refactoring
Aka: Refactoring, Quick Fix

## How to trigger in VSCode
Shortcut: `Ctrl+.`
Command: Quick Fix

## Usage inside the Aurelia extension

### Feature list
- Turn `<a href="xyz">` into `<import from="xyz">`
  - Why: In the absence of extension like [Path intellisense](https://github.com/ChristianKohler/PathIntellisense) one could leverage the completions capabilities of the a tag, then turn it into an `<import>` tag

### Backlog
- Turn `<a href="xyz">` into `<require from="xyz">`
- Select code in view -> refactor into own component
