# Aurelia VSCode Extension

🚧🚧🚧 Early Alpha 🚧🚧🚧

## Table of contents

- [1. Usage](#1-usage)
- [2. Why rewrite?](#2-why-rewrite)
- [3. Anyway, here is what's new (and what's missing)](#3-anyway-here-is-whats-new-and-whats-missing)
- [4. More Info](#4-more-info)

This is a complete rewrite. You are more than welcome to try it out.
We would be happy about your feedback!
*v1.0.7 is the previous stable version.*

## 1. Usage
- Have a tsconfig.json in the root
- Rest should be automatic
  - Debugging: In the VSCode Output Panel look for `Aurelia v2`, there you should see how many components where picked up

  ![image](https://user-images.githubusercontent.com/30693990/109438150-e689c080-7a28-11eb-99c5-b9a744862642.png)



## 2. Why rewrite?
The main objective was to get completions for objects in your Aureila View/Template.

<details>
<summary>Spoiler (expand)</summary>
<p>

![img](https://user-images.githubusercontent.com/30693990/96376629-6d2bb880-1180-11eb-866d-80480ec12e11.gif)

</p>
</details>

Eventually, all the work was continued in the rewrite, because new is always shiny.

## 3. Anyway, here is what's new (and what's missing)

### New
- Aurelia v2 compatible
  - Tested against [examples/realworld-advanced](https://github.com/aurelia/aurelia/tree/master/examples/realworld-advanced)
- Changes are now immediately available (no need to restart)
- **Completions**
  - Object completions in View
    - Possible limitations:
      - Imported types do not work
        - Thus, types from standard (typescript) lib will not complete either.
        - Arrays do not work (eg. `myVar[0].` will not show completions)
     -
- **Definitions**
  - Now, Value Converter can be "go to definition"
    - Limitation: Chained Value Converters only works for first one
- **Hover**

  <details>
  <summary>Hover.gif (expand)</summary>
  <p>

  ![au-hover-5](https://user-images.githubusercontent.com/30693990/109437553-a412b480-7a25-11eb-80d7-9c82f586357b.gif)

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


## 4. More Info
Check out the [Architecture document](docs/architechture.md#5-architecturepng) for a skeleton overview (expand for flowchart)


# Acknowledgment
- This extension started as a clone from [microsoft /
vscode-extension-samples / lsp-embedded-language-service](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service)
- The "virtual completions" approach was inspired by Vetur [Vetur docs](https://vuejs.github.io/vetur/guide/interpolation.html#generic-language-features)