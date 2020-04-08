- [1. Go To Definition](#1-go-to-definition)
    - [1.1. Correct file name](#11-correct-file-name)
    - [1.2. Bindable Attribute](#12-bindable-attribute)
      - [1.2.1. Bindable of Custom Element](#121-bindable-of-custom-element)
      - [1.2.2. Custom Attribute (later)](#122-custom-attribute-later)
    - [1.3. Custom Element](#13-custom-element)
    - [1.4. Require from](#14-require-from)
  - [2. Value Converter (later)](#2-value-converter-later)
  - [3. View Model Variable](#3-view-model-variable)
    - [3.1. ${ | } in view](#31----in-view)
    - [3.2. .bind="|"](#32-bind%22%22)
- [2. Autocomplete In View](#2-autocomplete-in-view)
    - [2.1. Custom Element Completion](#21-custom-element-completion)
    - [2.2. Custom Element Bindable Completion](#22-custom-element-bindable-completion)
    - [2.3.1 View Model Method Completion for attribute](#231-view-model-method-completion-for-attribute)
    - [2.3.2 View Model Method Completion for ${}](#232-view-model-method-completion-for)
    - [2.4.1 View Model Variable Completion attribute](#241-view-model-variable-completion-attribute)
    - [2.4.2 View Model Method Completion for ${}](#242-view-model-method-completion-for)

_Smartautocomplete Test Plan_

# 1. Go To Definition
### 1.1. Correct file name

### 1.2. Bindable Attribute

#### 1.2.1. Bindable of Custom Element
{{uIomH6bP}}
--> Should open view model of `my-compot.ts` at `@bindable fareWell`
```html
<my-compo string-bindable.bind="fareWell"></my-compo>
```

#### 1.2.2. Custom Attribute (later)
{{6e2vD6BY}}
--> Should open class of `SquareCustomAttribute`
```html
<div square="color.bind: squareColor; side-length.bind: squareSize"></div>
```

### 1.3. Custom Element
{{EUmcjqaIO}}
--> Should open view model of `my-compo.ts` at `class MyCompoCustomElement`
```html
<my-comp|o></my-compon>
```

### 1.4. Require from
{{uOE33Pqm}}
--> Should open view model of `my-compo.ts` at `class MyCompoCustomElement`
```html
<require from='my-compo/my-comp|o'></require>
```

## 2. Value Converter (later)
{{3BLEC0vn}}
```html
<tr repeat.for="repo of repos | sort:column.value:direction.value | take:10">
```

## 3. View Model Variable

### 3.1. ${ | } in view
{{xhdu5mWv}}
--> Should open `my-compo.ts` at eg. `public message: string;`
```html
<!-- my-compo.html -->
<div class="hello-component">${mes|sage}</div>
```

### 3.2. .bind="|"
{{hEePRI08}}
--> Should open view model `compo-user.ts` at `class CompoUserCustomElement`
```html
<!-- compo-user.html -->
<my-compo fare-well.bind="fare|Well"></my-compo>
```

# 2. Autocomplete In View

### 2.1. Custom Element Completion
{{hmtMmuEY}}
--> Should have completion for custom elements
```html
<|
```

### 2.2. Custom Element Bindable Completion
{{aqwmpQ1H}}
--> Should have completion for bindables of `my-compo.ts`
```html
<my-compo |></my-compo>
```

### 2.3.1 View Model Method Completion for attribute
{{tMPtsRoE}}
--> Should have completion for `autocomplete-in-view.ts` methods
```html
<my-compo string-bindable.bind=" |"></my-compo>
```

### 2.3.2 View Model Method Completion for ${}
{{Iku78qwA}}
--> Should have completion for `autocomplete-in-view.ts` methods
```html
${ }
```

### 2.4.1 View Model Variable Completion attribute
{{IuBC7VP8}}
--> Should have completion for `autocomplete-in-view.ts` variables
```html
<my-compo string-bindable.bind=|></my-compo>
```

### 2.4.2 View Model Method Completion for ${}
--> Should have completion for `autocomplete-in-view.ts` variables
{{Qf7at0ET}}
```html
${ }
```
