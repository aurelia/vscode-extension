import { TokenType, createScanner } from './htmlScanner';

export class Node {
  public tag: string;
  public closed: boolean;
  public endTagStart: number;
  constructor(public start: number, public end: number, public children: Node[], public parent: Node) {

  }
  public get firstChild(): Node { return this.children[0]; }
  public get lastChild(): Node { return this.children.length ? this.children[this.children.length - 1] : void 0; }

  public findNodeBefore(offset: number): Node {
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

  public findNodeAt(offset: number): Node {
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

export interface HTMLDocument {
  roots: Node[];
  findNodeBefore(offset: number): Node;
  findNodeAt(offset: number): Node;
}

export function parse(text: string): HTMLDocument {
  let scanner = createScanner(text);

  let htmlDocument = new Node(0, text.length, [], null);
  let curr = htmlDocument;
  let endTagStart: number = -1;
  let token = scanner.scan();
  while (token !== TokenType.EOS) {
    // tslint:disable-next-line:switch-default
    switch (token) {
      case TokenType.StartTagOpen:
        let child = new Node(scanner.getTokenOffset(), text.length, [], curr);
        curr.children.push(child);
        curr = child;
        break;
      case TokenType.StartTag:
        curr.tag = scanner.getTokenText();
        break;
      case TokenType.StartTagClose:
        curr.end = scanner.getTokenEnd(); // might be later set to end tag position
        if (isEmptyElement(curr.tag) && curr !== htmlDocument) {
          curr.closed = true;
          curr = curr.parent;
        }
        break;
      case TokenType.EndTagOpen:
        endTagStart = scanner.getTokenOffset();
        break;
      case TokenType.EndTag:
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
      case TokenType.StartTagSelfClose:
        if (curr !== htmlDocument) {
          curr.closed = true;
          curr.end = scanner.getTokenEnd();
          curr = curr.parent;
        }
        break;
      case TokenType.EndTagClose:
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

function findFirst<T>(array: T[], p: (x: T) => boolean): number {
  let low = 0;
  let high = array.length;
  if (high === 0) {
    return 0; // no children
  }
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (p(array[mid])) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

function binarySearch<T>(array: T[], key: T, comparator: (op1: T, op2: T) => number): number {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    // tslint:disable-next-line:no-bitwise
    let mid = ((low + high) / 2) | 0;
    let comp = comparator(array[mid], key);
    if (comp < 0) {
      low = mid + 1;
    } else if (comp > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -(low + 1);
}

export const EMPTY_ELEMENTS: string[] = [
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
  'wbr'];

function isEmptyElement(e: string): boolean {
  return e && binarySearch(EMPTY_ELEMENTS, e.toLowerCase(), (s1: string, s2: string) => s1.localeCompare(s2)) >= 0;
}
function isSameTag(t1: string, t2: string): boolean {
  return t1 && t2 && t1.toLowerCase() === t2.toLowerCase();
}
