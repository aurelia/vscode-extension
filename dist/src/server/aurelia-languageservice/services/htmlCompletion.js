"use strict";
const htmlScanner_1 = require('../parser/htmlScanner');
const aureliaTagProvider_1 = require('../parser/aureliaTagProvider');
function doComplete(document, position, htmlDocument) {
    let tagProvider = aureliaTagProvider_1.getAureliaTagProvider();
    let result = {
        isIncomplete: false,
        items: []
    };
    let offset = document.offsetAt(position);
    let node = htmlDocument.findNodeBefore(offset);
    let text = document.getText();
    let scanner = htmlScanner_1.createScanner(text, node.start);
    let currentTag;
    let currentAttributeName;
    let token = scanner.scan();
    function getReplaceRange(replaceStart, replaceEnd = offset) {
        if (replaceStart > offset) {
            replaceStart = offset;
        }
        return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
    }
    function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
        let range = getReplaceRange(afterOpenBracket, tagNameEnd);
        tagProvider.collectTags((tag, label) => {
            result.items.push({
                label: tag,
                kind: 10 /* Property */,
                documentation: label,
                textEdit: { newText: tag, range: range }
            });
        });
        return result;
    }
    function getLineIndent(offset) {
        let start = offset;
        while (start > 0) {
            let ch = text.charAt(start - 1);
            if ("\n\r".indexOf(ch) >= 0) {
                return text.substring(start, offset);
            }
            if (!isWhiteSpace(ch)) {
                return null;
            }
            start--;
        }
        return text.substring(0, offset);
    }
    function collectCloseTagSuggestions(afterOpenBracket, matchingOnly, tagNameEnd = offset) {
        let range = getReplaceRange(afterOpenBracket, tagNameEnd);
        let closeTag = isFollowedBy(text, tagNameEnd, htmlScanner_1.ScannerState.WithinEndTag, htmlScanner_1.TokenType.EndTagClose) ? '' : '>';
        let curr = node;
        while (curr) {
            let tag = curr.tag;
            if (tag && !curr.closed) {
                let item = {
                    label: '/' + tag,
                    kind: 10 /* Property */,
                    filterText: '/' + tag + closeTag,
                    textEdit: { newText: '/' + tag + closeTag, range: range }
                };
                let startIndent = getLineIndent(curr.start);
                let endIndent = getLineIndent(afterOpenBracket - 1);
                if (startIndent !== null && endIndent !== null && startIndent !== endIndent) {
                    item.textEdit = { newText: startIndent + '</' + tag + closeTag, range: getReplaceRange(afterOpenBracket - 1 - endIndent.length) };
                    item.filterText = endIndent + '</' + tag + closeTag;
                }
                result.items.push(item);
                return result;
            }
            curr = curr.parent;
        }
        if (matchingOnly) {
            return result;
        }
        tagProvider.collectTags((tag, label) => {
            result.items.push({
                label: '/' + tag,
                kind: 10 /* Property */,
                documentation: label,
                filterText: '/' + tag + closeTag,
                textEdit: { newText: '/' + tag + closeTag, range: range }
            });
        });
        return result;
    }
    function collectTagSuggestions(tagStart, tagEnd) {
        collectOpenTagSuggestions(tagStart, tagEnd);
        collectCloseTagSuggestions(tagStart, true, tagEnd);
        return result;
    }
    function collectAttributeNameSuggestions(nameStart, nameEnd = offset) {
        let range = getReplaceRange(nameStart, nameEnd);
        let value = isFollowedBy(text, nameEnd, htmlScanner_1.ScannerState.AfterAttributeName, htmlScanner_1.TokenType.DelimiterAssign) ? '' : '="{{}}"';
        tagProvider.collectAttributes(currentTag, (attribute, type) => {
            let codeSnippet = attribute;
            if (type !== 'v' && value.length) {
                codeSnippet = codeSnippet + value;
            }
            result.items.push({
                label: attribute,
                kind: type === 'handler' ? 3 /* Function */ : 12 /* Value */,
                textEdit: { newText: codeSnippet, range: range }
            });
        });
        return result;
    }
    function collectAttributeValueSuggestions(valueStart, valueEnd) {
        let range;
        let addQuotes;
        if (offset > valueStart && offset <= valueEnd && text[valueStart] === '"') {
            // inside attribute
            if (valueEnd > offset && text[valueEnd - 1] === '"') {
                valueEnd--;
            }
            let wsBefore = getWordStart(text, offset, valueStart + 1);
            let wsAfter = getWordEnd(text, offset, valueEnd);
            range = getReplaceRange(wsBefore, wsAfter);
            addQuotes = false;
        }
        else {
            range = getReplaceRange(valueStart, valueEnd);
            addQuotes = true;
        }
        tagProvider.collectValues(currentTag, currentAttributeName, (value) => {
            let codeSnippet = addQuotes ? '"' + value + '"' : value;
            result.items.push({
                label: value,
                filterText: codeSnippet,
                kind: 11 /* Unit */,
                textEdit: { newText: codeSnippet, range: range }
            });
        });
        return result;
    }
    function scanNextForEndPos(nextToken) {
        if (offset === scanner.getTokenEnd()) {
            token = scanner.scan();
            if (token === nextToken && scanner.getTokenOffset() === offset) {
                return scanner.getTokenEnd();
            }
        }
        return offset;
    }
    while (token !== htmlScanner_1.TokenType.EOS && scanner.getTokenOffset() <= offset) {
        switch (token) {
            case htmlScanner_1.TokenType.StartTagOpen:
                if (scanner.getTokenEnd() === offset) {
                    let endPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                    return collectTagSuggestions(offset, endPos);
                }
                break;
            case htmlScanner_1.TokenType.StartTag:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentTag = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.AttributeName:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                currentAttributeName = scanner.getTokenText();
                break;
            case htmlScanner_1.TokenType.DelimiterAssign:
                if (scanner.getTokenEnd() === offset) {
                    return collectAttributeValueSuggestions(scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.AttributeValue:
                if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
                    return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
                }
                break;
            case htmlScanner_1.TokenType.Whitespace:
                if (offset <= scanner.getTokenEnd()) {
                    switch (scanner.getScannerState()) {
                        case htmlScanner_1.ScannerState.AfterOpeningStartTag:
                            let startPos = scanner.getTokenOffset();
                            let endTagPos = scanNextForEndPos(htmlScanner_1.TokenType.StartTag);
                            return collectTagSuggestions(startPos, endTagPos);
                        case htmlScanner_1.ScannerState.WithinTag:
                        case htmlScanner_1.ScannerState.AfterAttributeName:
                            return collectAttributeNameSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.BeforeAttributeValue:
                            return collectAttributeValueSuggestions(scanner.getTokenEnd());
                        case htmlScanner_1.ScannerState.AfterOpeningEndTag:
                            return collectCloseTagSuggestions(scanner.getTokenOffset() - 1, false);
                    }
                }
                break;
            case htmlScanner_1.TokenType.EndTagOpen:
                if (offset <= scanner.getTokenEnd()) {
                    let afterOpenBracket = scanner.getTokenOffset() + 1;
                    let endOffset = scanNextForEndPos(htmlScanner_1.TokenType.EndTag);
                    return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
                }
                break;
            case htmlScanner_1.TokenType.EndTag:
                if (offset <= scanner.getTokenEnd()) {
                    let start = scanner.getTokenOffset() - 1;
                    while (start >= 0) {
                        let ch = text.charAt(start);
                        if (ch === '/') {
                            return collectCloseTagSuggestions(start, false, scanner.getTokenEnd());
                        }
                        else if (!isWhiteSpace(ch)) {
                            break;
                        }
                        start--;
                    }
                }
                break;
            default:
                if (offset <= scanner.getTokenEnd()) {
                    return result;
                }
                break;
        }
        token = scanner.scan();
    }
    return result;
}
exports.doComplete = doComplete;
function isWhiteSpace(s) {
    return /^\s*$/.test(s);
}
function isWhiteSpaceOrQuote(s) {
    return /^[\s"]*$/.test(s);
}
function isFollowedBy(s, offset, intialState, expectedToken) {
    let scanner = htmlScanner_1.createScanner(s, offset, intialState);
    let token = scanner.scan();
    while (token === htmlScanner_1.TokenType.Whitespace) {
        token = scanner.scan();
    }
    return token == expectedToken;
}
function getWordStart(s, offset, limit) {
    while (offset > limit && !isWhiteSpace(s[offset - 1])) {
        offset--;
    }
    return offset;
}
function getWordEnd(s, offset, limit) {
    while (offset < limit && !isWhiteSpace(s[offset])) {
        offset++;
    }
    return offset;
}
//# sourceMappingURL=htmlCompletion.js.map