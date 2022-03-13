<p align="center">
  <a href="https://aurelia.io/" target="_blank">
    <img alt="Aurelia" src="./images/aurelia-logo.png">
  </a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.png">
  </a>
  <a href="https://app.circleci.com/pipelines/github/aurelia/vscode-extension">
  <img alt="CircleCI" src="https://circleci.com/gh/aurelia/aurelia.png?style=shield">
  </a>
  <a href="http://www.typescriptlang.org/">
  <img alt="TypeScript" src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.png">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=AureliaEffect.aurelia">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/AureliaEffect.aurelia">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=AureliaEffect.aurelia">
    <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/AureliaEffect.aurelia">
  </a>
</p>

# Aurelia VSCode Extension

*Quick links: --- [Troubleshooting](#troubleshooting) --- [Setup](#setup) --- [Configuration](#configuration) ---*

Provide Intellisense capabilities to your Aurelia project (through the [LSP](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)) by letting you access View Model variables in your Views, rename them across your components, and many other features.
For a complete list, check out the [Features](#features).
The extension works out of the box on Linux/Mac/Windows, but still allows you to customize it to your projects needs.

*⚠️ [Unstable warning](#unstable-warning)*

*(Defintions: Show all places where `<custom-element>` component is used)*
![defintions](images/definitions.png "defintions")

## Table of contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Features](#features)
- [Behavior](#behavior)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Releasing](#releasing)

## Setup
- Works out of the box, with zero configs, for any CLI generated project.

<!-- CLI -->
<table>
  <thead>
    <tr>
      <th>CLI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <pre>
  + --- root/
  |     + --- src/              // Default place where the Extension tries to search
  |                                  for Aurelia files
  |     + --- tsconfig.json     // (Optional) Powers all the language features
  |                                  (through a Typescript Program)
  |     + --- jsconfig.json     // Same as `tsconfig.json`
  |     + --- package.json      // Determine, if given project is an Aurelia project
        </pre>
      </td>
    </tr>
  </tbody>
</table>

<!-- Monorepo -->
<table>
  <thead>
    <tr>
      <th>Monorepo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <pre>
  + --- root/
  |    + --- aurelia/
  |        + --- src/             // Default place where the Extension tries to search
  |                                    for Aurelia files
  |        + --- tsconfig.json    // (Optional) Powers all the language features
  |                                    (through a Typescript Program)
  |        + --- package.json     // Determine, if given project is an Aurelia project
  |    + --- burelia/
  |        + (same as aurelia/)   // Behaves the same as `aurelia/`
  |    + --- non-aurelia/         // Will not get picked up
  |        + ...
        </pre>
      </td>
    </tr>
  </tbody>
</table>

<!-- Complex -->
<table>
  <thead>
    <tr>
      <th>Complex</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <pre>
  + --- root/
  |    + --- frontend/
  |        + --- aurelia/
  |            + --- src/             // Default place where the Extension tries to search
  |                                        for Aurelia files
  |            + --- tsconfig.json    // (Optional) Powers all the language features
  |                                        (through a Typescript Program)
  |            + --- package.json     // Determine, if given project is an Aurelia project
  |    + --- backend/
  |    + --- service/
        </pre>
      </td>
    </tr>
  </tbody>
</table>

### Typescript
- Cli generate project works out of the box (`npx makes au`)
- If you have a mixed JS and TS project, please add `allowJS: true` to your `tsconfig.json`

### Javascript
- Cli generate project works out of the box (`au new`)
- Less stable than Typescript, but should work still work most of the time.
  - Tested with `au new` project, and legacy monorepo setup, with 131 components

## Configuration
<!-- Complex -->
<table>
  <thead>
    <tr>
      <th>Complex</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <pre>
  + --- root/
  |    + --- frontend/                // aureliaProject.rootDirectory =
  |                                         absolute/path/root/frontend
  |        + --- aurelia/
  |            + --- deeper-path/
  |                + --- src/         // aureliaProject.pathToAureliaFiles =
  |                                         absolute/path/root/.../deeper-path/src
  |            + --- tsconfig.json    // aureliaProject.pathToTsConfig =
  |                                         absolute/path/root/.../aurelia/tsconfig.json
  |        + --- package.json         // aureliaProject.packageJsonInclude =
  |                                         absolute/path/root/.../frontend/package.json
  |    + --- backend/
  |    + --- service/
        </pre>
      </td>
    </tr>
  </tbody>
</table>

## Features
You can find a more detailed list of features [here](https://github.com/aurelia/vscode-extension/tree/develop/docs/developer).
Furthermore, our [tests](https://github.com/aurelia/vscode-extension/tree/master/tests/features) are in a readable format and can provide much deeper insights into the extension behavior. You are encouraged to check those out:

  <details>
    <summary>Preview test format (expand)</summary>
    The format, that is used is named [Gherkin](https://cucumber.io/docs/gherkin/)

    ```feature
      Feature: Completions - Methods.
        Background:
          Given the project is named "cli-generated"
          And I open VSCode with the following file "view-model-test.html"

        Scenario Outline: Empty brackets.
          Given I'm replacing the file content with <CODE>
          And I'm on the line <LINE> at character <CODE>
          When I trigger Suggestions with ''
          Then I should get the correct method <METHOD_NAME> with brackets

          Examples:
            | LINE | CODE                        | METHOD_NAME      |
            | 0    | `<div if.bind="f\|"></div>` | functionVariable |
    ```
  </details>

### Features table
*(Legend below)*

| Feature/Region     | A/AI/TI | BA  | BB  | CA  | CE  | HTML | I/R | RF  | Signal | VC  |
| ------------------ | ------- | --- | --- | --- | --- | ---- | --- | --- | ------ | --- |
| Code Action        | ➖       | ➖   | ➖   | ➖   | ➖   | ➕    | ➖   | ➖   | ➖      | ➖   |
| Completion         | ➕       | ➕   | ➖   | ➖   | ➕   | ➕    | ➕   | ➕   | ➖      | ➕   |
| Definition         | ➕       | ➕   | ➖   | ➖   | ➕   | ➕    | ➕   | ➕*  | ➖      | ➕   |
| Diagnostics        | ➖       | ➖   | ➖   | ➖   | ➖   | ➕    | ➖   | ➖   | ➖      | ➖   |
| Hover              | ➖       | ➖   | ➖   | ➖   | ➖   | ➕    | ➖   | ➖   | ➖      | ➖   |
| Rename             | ➕       | ➕   | ➖   | ➖   | ➕   | ➕    | ➖   | ➕*  | ➖      | ➖   |
| (Document) Symbol  | ➕       | ➕   | ➖   | ➖   | ➕   | ➕    | ➕   | ➕   | ➖      | ➕   |
| (Workspace) Symbol | ➕       | ➕   | ➖   | ➖   | ➕   | ➕    | ➕   | ➕   | ➖      | ➕   |

*Missing*: Router, Promise, `<let>`

#### Legend

➕ : Supported  ➕* : Partially (or unsable) supported  ➖ : Not supported
|                            |                     |                       |
| -------------------------- | ------------------- | --------------------- |
| A: Attribute               | CA: CustomAttribute | RF: RepeatFor         |
| AI: AttributeInterpolation | CE: CustomElement   | TI: TextInterpolation |
| BA: BindableAttribute      | HTML: HTML          | VC: ValueConverter    |
| BB: BindingBehavior        | I/R: Import/Require |                       |

## Behavior
- Startup
  - Check if given project is Aurelia project
  - Go through all .js/.ts files, and check whether those are Aurelia components
  - Assemble information to provide features.
- Non-aurelia projects
  - Don't scan non-aurelia projects
  - Don't activate when you only have non-aurelia project files open
    - Will activate as soon, as you open aurelia-related file, else [Troubleshooting](#troubleshooting)
- Aurelia components
  - Picks up Aurelia components via naming convention or `@customElement` decorator
    - [Official docs on convention](https://docs.aurelia.io/getting-to-know-aurelia/components/creating-components#convention-less-components)

## Installation
### vsix
You can manually install the extension by downloading the .vsix file in the top right section under "Release".
Once you downloaded it, install via
```
code --install-extension aurelia-2.x.y.vsix
```

## Troubleshooting

### Self diagnostics
1. Logs
   1. Open the Output panel of VSCode ("Output: Focus on Output View")
   2. Select "Aurelia"
2. Reloading
   - "Aurelia: Reload Extension"
   - Should behave the same as a full VSCode reload/restart
3. If nothing from above helps, [submit an issue](https://github.com/aurelia/vscode-extension/issues/new), and we kindly ask you to follow the steps in the issue template.

### General issues
- Completions
  - I don't get any completions (or other any feature).
    - There are cases where completions will not trigger. For a more detailed explanation visit [the Completions docs](docs/user/completions.readme.md#Limitations)
  - I get undesired completions
    - Unfortunately a known issue. Regardless, please [open an issue](https://github.com/aurelia/vscode-extension/issues/new) to help improve the developer experience.
  - Sometimes completitions don't appear
    - Unfortunately a known issue. There are 2 sides
      1. Javascript/Typescript completions: We depend on a [Typescript Program](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler), to enable rich completions for your Views. This could be still an issue on our side, but chances are, that if *some* completions work, and others don't, that there is no way to improve this (to our current knowledge).
      2. Aurelia related completions. Likely a bug on our side.

- Extension not working as expected
  - The extension does not pick up my project
    - If the other sections ([Setup](#setup), [Configuration](#configuration)) did not help please [open an issue](https://github.com/aurelia/vscode-extension/issues/new)
  - The extension causes my project to be slow
    - We tried reduce response time as much as possible. If the extension still causes too much slowness, you can turn off individual features in the settings under `aurelia.capabilities`. Else please [open an issue](https://github.com/aurelia/vscode-extension/issues/new)
  - The extension does not work on Windows/Mac/Linux
    - Windows: The extension was mainly developed on a Linux and a Mac machine. We tried to test on Windows as well, but are less confident on the stability. It would be great if you can help us improve the experience on Windows by [opening an issue](https://github.com/aurelia/vscode-extension/issues/new)

### Unstable warning
Please note, that due to the low iteration count, all features may not be as stable as we like them to be. Before submitting and issue, check out the [General issues](#general-issues), [Troubleshooting](#troubleshooting) and [FAQ] section.
If you still haven't found a solution to your problem, you are more than welcome to [open an issue](https://github.com/aurelia/vscode-extension/issues/new).
The extension is in active use by the authors, so you can expect a swift response, but do note, that an actual fix cannot be guaranteed. Regardless, we are thankful, that you took the time to troubleshoot with us!

## Releasing
```
# l.
bumb version in package.json
"version": "2.3.2"
npm run changelog
commit: chore(release): release v2.3.2

# 2.
git tag -a 2.3.2 -m "v2.3.2"
git push --follow-tags
```

### Prerelease
Use odd minor versions

### "Real" Release
Use even minor versions


## Acknowledgment

- This extension started as a clone from [microsoft / vscode-extension-samples / lsp-embedded-language-service](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service)
- The "virtual completions" approach was inspired by Vetur [Vetur docs](https://vuejs.github.io/vetur/guide/interpolation.html#generic-language-features)
