"use strict";
const vscode = require('vscode');
class AureliaHtmlCompletionOptionsFactory {
    static getForAttribute(attributeName) {
        let completions = [];
        if (AureliaHtmlCompletionOptionsFactory.dataBindingAttributes.indexOf(attributeName) > -1) {
            completions.push(...AureliaHtmlCompletionOptionsFactory.getBindingOptions(attributeName));
        }
        if (AureliaHtmlCompletionOptionsFactory.eventBindingAttributes.indexOf(attributeName) > -1) {
            completions.push(...AureliaHtmlCompletionOptionsFactory.getEventOptions(attributeName));
        }
        return completions;
    }
    static getBindingOptions(attributeName) {
        let elements = [];
        // .bind
        let twoWayDefaultBindAttributes = ['value', 'checked', 'model'];
        let bind = new vscode.CompletionItem('bind', vscode.CompletionItemKind.Property);
        bind.insertText = `bind=""`;
        if (twoWayDefaultBindAttributes.indexOf(attributeName) > -1) {
            bind.documentation = 'default binding(two-way) \r\n Flows data both ways: from view-model to view and from view to view-model.';
        }
        else {
            bind.documentation = 'default binding(one-way) \r\n Flows data one direction: from the view-model to the view.';
        }
        elements.push(bind);
        // .one-way
        let oneWay = new vscode.CompletionItem('one-way', vscode.CompletionItemKind.Property);
        oneWay.insertText = `one-way=""`;
        oneWay.documentation = 'Flows data one direction: from the view-model to the view.';
        elements.push(oneWay);
        // .two-way
        let twoWay = new vscode.CompletionItem('two-way', vscode.CompletionItemKind.Property);
        twoWay.insertText = `two-way=""`;
        twoWay.documentation = 'Flows data both ways: from view-model to view and from view to view-model.';
        elements.push(twoWay);
        // .one-time
        let oneTime = new vscode.CompletionItem('one-time', vscode.CompletionItemKind.Property);
        oneTime.insertText = `one-time=""`;
        oneTime.documentation = 'Renders data once, but does not synchronize changes after the initial render.';
        elements.push(oneTime);
        // ref
        let ref = new vscode.CompletionItem('ref', vscode.CompletionItemKind.Property);
        ref.insertText = `ref=""`;
        ref.documentation = 'Creates a reference to an HTML element, a component or a component\'s parts.';
        elements.push(ref);
        return elements;
    }
    static getEventOptions(attributeName) {
        let elements = [];
        // .trigger
        let trigger = new vscode.CompletionItem('trigger', vscode.CompletionItemKind.Property);
        trigger.insertText = `trigger=""`;
        trigger.documentation = 'Attaches an event handler directly to the element. When the event fires, the expression will be invoked.' +
            '\r\n\r\n The $event value can be passed as an argument to a delegate or trigger function call if you need to access the event object.';
        elements.push(trigger);
        // .delegate
        let delegate = new vscode.CompletionItem('delegate', vscode.CompletionItemKind.Property);
        delegate.insertText = `delegate=""`;
        delegate.documentation = 'Attaches a single event handler to the document (or nearest shadow DOM boundary) which handles all events of ' +
            'the specified type, properly dispatching them back to their original targets for invocation of the associated expression. ' +
            '\r\n\r\n The $event value can be passed as an argument to a delegate or trigger function call if you need to access the event object.';
        elements.push(delegate);
        // .call
        let call = new vscode.CompletionItem('call', vscode.CompletionItemKind.Text);
        call.insertText = `call=""`;
        call.documentation = 'Passes a function reference.';
        elements.push(call);
        return elements;
    }
}
AureliaHtmlCompletionOptionsFactory.dataBindingAttributes = [
    'if',
    'accept',
    'accept-charset',
    'accesskey',
    'action',
    'align',
    'alt',
    'buffered',
    'challange',
    'charset',
    'checked',
    'cite',
    'class',
    'code',
    'codebase',
    'color',
    'cols',
    'colspan',
    'content',
    'contenteditable',
    'contextmenu',
    'controls',
    'coords',
    'data',
    'datetime',
    'default',
    'defer',
    'dir',
    'dirname',
    'disabled',
    'download',
    'dragabble',
    'dropzone',
    'enctype',
    'for',
    'form',
    'formaction',
    'headers',
    'height',
    'hidden',
    'hidden',
    'high',
    'href',
    'hreflang',
    'http-equiv',
    'icon',
    'id',
    'innerhtml',
    'ismap',
    'itemprop',
    'keytype',
    'kind',
    'label',
    'lang',
    'language',
    'list',
    'loop',
    'low',
    'manifest',
    'max',
    'maxlength',
    'media',
    'method',
    'min',
    'multiple',
    'muted',
    'name',
    'novalidate',
    'open',
    'optimum',
    'pattern',
    'ping',
    'placeholder',
    'poster',
    'preload',
    'radiogroup',
    'readonly',
    'rel',
    'required',
    'reversed',
    'rows',
    'rowspan',
    'sandbox',
    'scope',
    'seamless',
    'selected',
    'shape',
    'size',
    'sizes',
    'span',
    'spellcheck',
    'src',
    'srcdoc',
    'srclang',
    'srcset',
    'start',
    'step',
    'style',
    'summary',
    'tabindex',
    'target',
    'title',
    'type',
    'usemap',
    'value',
    'width',
    'wrap',
];
AureliaHtmlCompletionOptionsFactory.eventBindingAttributes = [
    'keydown',
    'keypress',
    'keyup',
    'mouseenter',
    'mouseover',
    'mousedown',
    'mouseup',
    'click',
    'dbclick',
    'contextmenu',
    'wheel',
    'mouseleave',
    'mouseout',
    'select',
    'pointerlockchange',
    'pointerlockerror',
    'dragstart',
    'drag',
    'dragenter',
    'dragover',
    'dragleave',
    'drop',
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AureliaHtmlCompletionOptionsFactory;
//# sourceMappingURL=aureliaHtmlCompletionOptionsFactory.js.map