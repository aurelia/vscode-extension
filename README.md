# Aurelia VSCode Extension

*Quick links:* [Troubleshooting](#troubleshooting) - [Setup](#setup) - [Configuration](#configuration)

Provide Intellisense capabilities to your Aurelia project (through the [LSP](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)) by letting you access View Model variables in your Views, rename them across your components, and many other features.
For a complete list, check out the [Features](#features).
The extension works out of the box on Linux/Mac/Windows, but still allows you to customize it to your projects needs.

*⚠️ [Unstable warning](#unstable-warning)*

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
  |     + --- src/              // Default place where the Extension tries to search for
  |                                  Aurelia files
  |     + --- tsconfig.json     // (Optional) Powers all the language features (through a
  |                                  Typescript Program)
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
  |        + --- src/             // Default place where the Extension tries to search for
  |                                    Aurelia files
  |        + --- tsconfig.json    // (Optional) Powers all the language features (through a
  |                                    Typescript Program)
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
  |            + --- src/             // Default place where the Extension tries to search for
  |                                        Aurelia files
  |            + --- tsconfig.json    // (Optional) Powers all the language features (through
  |                                        a Typescript Program)
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
  |    + --- frontend/                 // aureliaProject.rootDirectory =
  |                                         absolute/path/root/frontend
  |        + --- aurelia/
  |            + --- deeper-path/
  |                + --- src/          // aureliaProject.pathToAureliaFiles =
  |                                         absolute/path/root/.../deeper-path/src
  |            + --- tsconfig.json     // aureliaProject.pathToAureliaFiles =
  |                                         absolute/path/root/.../aurelia/tsconfig.json
  |        + --- package.json          // aureliaProject.packageJsonInclude =
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
Furthermore, our tests are readable and can provide much deeper insights into the extension behavior. You are encouraged to check those out:

  <details>
    <summary>Sneak peak (expand)</summary>
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

#### Features table
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

##### Legend

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

## Troubleshooting

### General issues
- I don't get any completions (or other any feature).
  -
- The extension does not pick up my project
- The extension causes my project to be slow
- The extension does not work on Windows/Mac/Linux
  - Windows: The extension was mainly developed on a Linux and a Mac machine. We tried to test on Windows as well, but are less confident on the stability. It would be great if you can help us improve the experience on Windows by

### Self diagnostics
1. Logs
   1. Open the Output panel of VSCode ("Output: Focus on Output View")
   2. Select "Aurelia"
2. Reloading
   - "Aurelia: Reload Extension"
   - Should behave the same as a full VSCode reload/restart
3. If nothing from above helps, [submit an issue](https://github.com/aurelia/vscode-extension/issues/new), and we kindly ask you to follow the steps in the issue template.

### Unstable warning
Please note, that due to the low iteration count, all features may not be as stable as we like them to be. Before submitting and issue, check out the [General issues](#general-issues), [Troubleshooting](#troubleshooting) and [FAQ] section.
If you still haven't found a solution to your problem, you are more than welcome to [open an issue](https://github.com/aurelia/vscode-extension/issues/new).
The extension is in active use by the authors, so you can expect a swift response, but do note, that an actual fix cannot be guaranteed. Regardless, we are thankful, that you took the time to troubleshoot with us!



## Table of contents

- [Aurelia VSCode Extension](#aurelia-vscode-extension)
  - [Setup](#setup)
    - [Typescript](#typescript)
    - [Javascript](#javascript)
  - [Configuration](#configuration)
  - [Features](#features)
      - [Features table](#features-table)
        - [Legend](#legend)
  - [Behavior](#behavior)
  - [Troubleshooting](#troubleshooting)
    - [General issues](#general-issues)
    - [Self diagnostics](#self-diagnostics)
    - [Unstable warning](#unstable-warning)
  - [Table of contents](#table-of-contents)
  - [1. Usage](#1-usage)
    - [Minimal Setup](#minimal-setup)
    - [Configuration](#configuration-1)
      - [Project](#project)
  - [2. Features](#2-features)
    - [New](#new)
    - [Missing (from v1)](#missing-from-v1)
  - [3. More Info](#3-more-info)
- [Acknowledgment](#acknowledgment)

## 1. Usage

- Have a tsconfig.json in the root
- Rest should be automatic

  - Debugging: In the VSCode Output Panel look for `Aurelia`, there you should see how many components where picked up

    <details>
      <summary>Example.png (expand)</summary>

    ![image](https://user-images.githubusercontent.com/30693990/109438150-e689c080-7a28-11eb-99c5-b9a744862642.png)
    </details>

### Minimal Setup

```
+ --- root/
|      + --- src/
|      + --- tsconfig.json
```

### Configuration

#### Project

You are able to configure `root`, `src`, and `tsconfig.json` (cf. [Minimal Setup](#minimal-setup))

- `root`

  <details>
    <summary>Configs (expand)</summary>

  ```json
    "aurelia.aureliaProject": {
      "rootDirectory": {
        "type": "string",
        "description": "Provide a custom directory for the root."
      }
    },
  ```

  </details>

- `src`
  You don't have to name this folder `src`.
  Change it via the `include` field below (as glob).

    <details>
      <summary>Configs (expand)</summary>

      ```json
        "aurelia.aureliaProject": {
          "include": {
            "type": "array",
            "description": "Includes for your Aurelia Project",
            "default": ["src"]
          },
          "exclude": {
            "type": "array",
            "description": "Exlcudes for your Aurelia Project",
            "default": [
              "**/node_modules",
              "aurelia_project",
              "**/out",
              "**/build",
              "**/dist"
            ]
          }
        },
      ```

    </details>

- `tsconfig.json`

  <details>
    <summary>Configs (expand)</summary>

  ```json
    "aurelia.pathToTsConfig": {
      "type": "string",
      "description": "Provide an absolute path to a tsconfig.json"
    }
  ```

  </details>

## 2. Features

### New

- Aurelia v2 compatible
  - Tested against [examples/realworld-advanced](https://github.com/aurelia/aurelia/tree/master/examples/realworld-advanced)
- Changes are now immediately available (no need to restart)
- **Completions**

  - Object completions in View

    - Example
      <details>
        <summary>Completions.gif (expand)</summary>

      ![completions.gif](/images/completions.gif "hello")
      </details>

    - Possible limitations:
      - Imported types do not work
        - Thus, types from standard (typescript) lib will not complete either.
        - Arrays do not work (eg. `myVar[0].` will not show completions)

- **Definitions**
  - Now, Value Converter can be "go to definition"
    - Limitation: Chained Value Converters only works for first one
- **Hover**

  <details>
  <summary>Hover.gif (expand)</summary>
  <p>

  ![au-hover-5](/images/hover.gif)

  </p>
  </details>

### Missing (from v1)

- `mousedown.delegate`, and alike
  - Currently, you would need to type `mousedown`, and _only after_ typing `.` you would get completion for `delegate`
- Some diagnostics, eg.
  - eg. `.one-way=""` is deprecated
  - casing
- Aurelia Themes
- Au CLI commands
- .js support. (You would need a tsconfig.json file in the root, which would work then.)

## 3. More Info

Check out the [Architecture document](docs/developer/architechture.md#5-architecturepng) for a skeleton overview.

# Acknowledgment

- This extension started as a clone from [microsoft / vscode-extension-samples / lsp-embedded-language-service](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service)
- The "virtual completions" approach was inspired by Vetur [Vetur docs](https://vuejs.github.io/vetur/guide/interpolation.html#generic-language-features)
