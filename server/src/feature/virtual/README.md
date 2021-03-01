
# Purpose

## Background

#### Original Idea:
Get view model (typescript) completions in view (.html)

#### Idea
(From Vetur)
1. Get content from .html (via embedded regions)
2. Create a "virtual" file
3. Insert content into virtual file
4. Unleash [TLS]
5. Completions, definition, quickinfo, ...

## Terminology / Abbreviations
- [embedded regions](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service)
- virtual: Copy of a file, that is used as replacement (eg. with modification to get certain completion result via typescript language service)
- [TLS] - Typescript Language Service


# Structure
1. [/virtual](./virtualSourceFile.ts)
    1.1 [/virtualCompletion](./virtualCompletion/virtualCompletion.ts)
    1.2 [/virtualDefinition](./virtualDefinition/virtualDefinition.ts)


## Explanation of functions
*[F] - indicates points where a function is explained.*
*No indicator is pure explanation*

1. `createVirtualViewModelSourceFile`
Riding on the [Idea](#idea) 2., we start the virtual file creation.
- .
    1.1 Arguments of that function
	- .
        - `originalSourceFile: ts.SourceFile,`
        - `virtualContent: string,`
        - `targetClassName: string`

	1.2 Return
	- .
		- `virtualSourcefile,`
		- `virtualCursorIndex,`

2. With the result from 1.2 we can now continue onto leveraging the [TLS]

3. We illustrate the "completion" use case of a virutal file

4. [F] [getVirtualViewModelCompletion](./virtualCompletion/virtualCompletion.ts)

    4.1 1. assumed, that we have the source file, the content, and the target class name. But all of these have to be provided

	4.2 So, before we can create a virtual file, we have to gather the prerequisits

	4.3 Arguments
	- .
        - `textDocumentPosition: TextDocumentPositionParams,`
        - `document: TextDocument,`
        - `aureliaProgram: AureliaProgram`

		These arguments come from VSCode's completion callback

	4.4 Example code path

	```ts
	// server.ts

		// This handler provides the initial list of the completion items.
		connection.onCompletion(
		async (
			_textDocumentPosition: TextDocumentPositionParams // <
		): Promise<CompletionItem[] | CompletionList> => {
			const documentUri = _textDocumentPosition.textDocument.uri;
			const document = documents.get(documentUri); // <

	// completion user
		const aureliaVirtualCompletions = await getAureliaVirtualCompletions(
			_textDocumentPosition,
			document
		);

	```

# Analysis
Figure out each step, and try to abstract to achieve simplier API

## Completions
// 1. From the region get the part, that should be made virtual.

// 2. Get original viewmodel file based on view

// 3. Create virtual completion

// 4. Use TLS <---- TODO: REFACTOR into separate function (currently just copy pasted)

// 5. Serialize data with result from 4. <--- Can prob. DRY here as well.

getVirtualViewModelCompletion
- .
    - createVirtualViewModelSourceFile // /virtual, eg. the (common) parent
	- getVirtualCompletion // 4.
	    - do TLS
		- can put callbacks for `cls.getCompletionsAtPosition`



- TextDocument
	- Position
		- Region
			- view model
			- view
	- Document
		- view model
		- view


createVirtualLanguageService
	- textDocument
		- content?
			- <- direct
			- <- region

```ts
onCompletion(textDocument)
  const document = ...

interface VirtualLanguageService {
    /**
	 * If triggered in my-compo.html, then go to my-compo.ts
	 */
	relatedViewModel: boolean;
	/**
	 * Will overwrite `relatedViewModel`, for custom source file
	 */
	sourceFile: ts.SourceFile;
}

doCompletion(textDocument, document, triggerCharacter, region) {
	const vls = createVirtualLanguageService(textDocument, document, {
		relatedViewModel: boolean
	})
	vls.getDefinitionAtPosition() // <--- Difference to ts.getDefinitionAtPosition, is that we want the position from the region ?!
}

```




## Definition