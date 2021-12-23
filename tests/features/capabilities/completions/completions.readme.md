
## Definition

## How to trigger in VSCode
Shortcut: `Ctrl+i` or `Cmd+i`, or by typing a trigger character (eg. <, ", Space, [other](https://github.com/aurelia/vscode-extension/blob/61376419796275b4e3b8e56dce069282e4697dde/server/src/server.ts#L78))
Command: Trigger Suggest

## Usage inside the Aurelia extension

### Feature list
Note: The `|` indicates your cursor position *after* the character, that should have been typed, eg.
if `foo.|` is written, then you should type `.` (Dot) after `foo`.

- Aurelia keywords
  - ```html
    <p><|</p>
    ```
  - ```html
    <p |></p>
    ```

  - Examples:
    - `repeat.for=""`
    - `<require from="">` (or import)
    - Full list ([constants.ts](https://github.com/aurelia/vscode-extension/blob/e89fa44e00ec1b16066d734fbebc01e459df09b9/server/src/common/constants.ts#L101))

- Class members (Variable and Methods)
  - ```html
    <p if.bind="|"></p>
    ```
  - ```html
    <p if="${|}"></p>
    ```
  - Note: Methods will be completed with arguments or just empty parenthesis

- Standard Javascript methods
  - ```html
    <p if="${aStringVariables.|}"></p>
    ```

- Object completions
  - ```html
    <p if="${obj.|}"></p>
    ```

- Value converters
  - ```html
    <p if.bind="foo || "></p>
    ```

### Limitations
- Method/Object completions don't work for imports, that are aliases, eg.
  - `import 'alias/dir/files'` <- Does not work
  - `import '../../dir/files'` <- Works
  - Why: We are using the Typescript Language Server, which does not seem to handle that
    - https://github.com/Microsoft/TypeScript/issues/25677
    - "Lets you set a base directory to resolve non-absolute module names." https://www.typescriptlang.org/tsconfig#baseUrl
- Typing in the middle of an Interpolation, eg. `${foo| && bar}` will not reliably trigger suggestions
- Custom Attributes not supported

### Backlog
- Value Converter arguments
- Binding Behavior
- Repeat for regions iterator (`repeat.for="foo of fooList"`, then in the view, you should also get completions for `foo`. Ideally, the type of foo should be correct, but we could be hard to do)
- Access `<let>` definitions in view (Ideally, the typeshould be correct, but that could be hard to do)
- Access definitions from promise binding in view (Ideally, the typeshould be correct, but that could be hard to do). [Promise attribute docs](https://docs.aurelia.io/getting-to-know-aurelia/introduction/built-in-template-features/promise.bind)
- Contextual variables (`$index` or `$odd`)
- Support HTML-only Custom Elements
- Import from 3rd party libraries
- Account for Aurelia v1 and v2 (eg. only trigger v1 relevant suggestions)
- `import|` where you press `Tab` at | to turn it into a tag
