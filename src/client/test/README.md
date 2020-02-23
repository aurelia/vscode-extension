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

#### 3.1. ${ | } in view
{{xhdu5mWv}}
--> Should open `my-compo.ts` at eg. `public message: string;`
```html
<!-- my-compo.html -->
<div class="hello-component">${mes|sage}</div>
```

#### 3.2. .bind="|"
{{hEePRI08}}
--> Should open view model `compo-user.ts` at `class CompoUserCustomElement`
```html
<!-- compo-user.html -->
<my-compo fare-well.bind="fare|Well"></my-compo>
```
