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

## Table of contents

- [1. Usage](#1-usage)
  - [Minimal Setup](#minimal-setup)
  - [Configuration](#configuration)
- [2. Features](#2-features)
  - [New](#new)
  - [Missing (from v1)](#missing-from-v1)
- [3. More Info](#3-more-info)

## 1. Usage

- Have a tsconfig.json in the root
- Rest should be automatic

  - Debugging: In the VSCode Output Panel look for `Aurelia v2`, there you should see how many components where picked up

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

Check out the [Architecture document](docs/architechture.md#5-architecturepng) for a skeleton overview.

# Acknowledgment

- This extension started as a clone from [microsoft / vscode-extension-samples / lsp-embedded-language-service](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service)
- The "virtual completions" approach was inspired by Vetur [Vetur docs](https://vuejs.github.io/vetur/guide/interpolation.html#generic-language-features)
