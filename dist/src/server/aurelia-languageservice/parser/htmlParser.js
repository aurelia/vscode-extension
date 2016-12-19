"use strict";
const htmlScanner_1 = require("./htmlScanner");
class Node {
    constructor(start, end, children, parent) {
        this.start = start;
        this.end = end;
        this.children = children;
        this.parent = parent;
    }
    get firstChild() { return this.children[0]; }
    get lastChild() { return this.children.length ? this.children[this.children.length - 1] : void 0; }
    findNodeBefore(offset) {
        let idx = findFirst(this.children, c => offset <= c.start) - 1;
        if (idx >= 0) {
            let child = this.children[idx];
            if (offset > child.start) {
                if (offset < child.end) {
                    return child.findNodeBefore(offset);
                }
                let lastChild = child.lastChild;
                if (lastChild && lastChild.end === child.end) {
                    return child.findNodeBefore(offset);
                }
                return child;
            }
        }
        return this;
    }
    findNodeAt(offset) {
        let idx = findFirst(this.children, c => offset <= c.start) - 1;
        if (idx >= 0) {
            let child = this.children[idx];
            if (offset > child.start && offset <= child.end) {
                return child.findNodeAt(offset);
            }
        }
        return this;
    }
}
exports.Node = Node;
function parse(text) {
    let scanner = htmlScanner_1.createScanner(text);
    let htmlDocument = new Node(0, text.length, [], null);
    let curr = htmlDocument;
    let endTagStart = -1;
    let token = scanner.scan();
    while (token !== htmlScanner_1.TokenType.EOS) {
        // tslint:disable-next-line:switch-default
        switch (token) {
            case htmlScanner_1.TokenType.StartTagOpen:
                let child = new Node(scanner.getTokenOffset(), text.length, [], curr);
                curr.children.push(child);
                curr = child;
                break;
            case htmlScanner_1.TokenType.StartTag:
                curr.tag = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.StartTagClose:
                curr.end = scanner.getTokenEnd(); // might be later set to end tag position
                if (isEmptyElement(curr.tag) && curr !== htmlDocument) {
                    curr.closed = true;
                    curr = curr.parent;
                }
                break;
            case htmlScanner_1.TokenType.EndTagOpen:
                endTagStart = scanner.getTokenOffset();
                break;
            case htmlScanner_1.TokenType.EndTag:
                let closeTag = scanner.getTokenText();
                while (!isSameTag(curr.tag, closeTag) && curr !== htmlDocument) {
                    curr.end = endTagStart;
                    curr.closed = false;
                    curr = curr.parent;
                }
                if (curr !== htmlDocument) {
                    curr.closed = true;
                    curr.endTagStart = endTagStart;
                }
                break;
            case htmlScanner_1.TokenType.StartTagSelfClose:
                if (curr !== htmlDocument) {
                    curr.closed = true;
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
            case htmlScanner_1.TokenType.EndTagClose:
                if (curr !== htmlDocument) {
                    curr.end = scanner.getTokenEnd();
                    curr = curr.parent;
                }
                break;
        }
        token = scanner.scan();
    }
    while (curr !== htmlDocument) {
        curr.end = text.length;
        curr.closed = false;
        curr = curr.parent;
    }
    return {
        findNodeAt: htmlDocument.findNodeAt.bind(htmlDocument),
        findNodeBefore: htmlDocument.findNodeBefore.bind(htmlDocument),
        roots: htmlDocument.children,
    };
}
exports.parse = parse;
function findFirst(array, p) {
    let low = 0;
    let high = array.length;
    if (high === 0) {
        return 0; // no children
    }
    while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (p(array[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return low;
}
function binarySearch(array, key, comparator) {
    let low = 0;
    let high = array.length - 1;
    while (low <= high) {
        // tslint:disable-next-line:no-bitwise
        let mid = ((low + high) / 2) | 0;
        let comp = comparator(array[mid], key);
        if (comp < 0) {
            low = mid + 1;
        }
        else if (comp > 0) {
            high = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -(low + 1);
}
exports.EMPTY_ELEMENTS = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];
function isEmptyElement(e) {
    return e && binarySearch(exports.EMPTY_ELEMENTS, e.toLowerCase(), (s1, s2) => s1.localeCompare(s2)) >= 0;
}
function isSameTag(t1, t2) {
    return t1 && t2 && t1.toLowerCase() === t2.toLowerCase();
}
//# sourceMappingURL=htmlParser.js.map