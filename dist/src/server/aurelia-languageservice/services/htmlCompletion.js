"use strict";
const htmlScanner_1 = require('../parser/htmlScanner');
const aureliaTagProvider_1 = require('../parser/aureliaTagProvider');
function doComplete(document, position, htmlDocument, quotes) {
    let quote = '"';
    if (quotes === 'single') {
        quote = '\'';
    }
    let tagProvider = aureliaTagProvider_1.getAureliaTagProvider();
    let result = {
        isIncomplete: false,
        items: [],
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
        return {
            end: document.positionAt(replaceEnd),
            start: document.positionAt(replaceStart),
        };
    }
    function collectOpenTagSuggestions(afterOpenBracket, tagNameEnd) {
        let range = getReplaceRange(afterOpenBracket, tagNameEnd);
        tagProvider.collectTags((tag, label) => {
            result.items.push({
                documentation: label,
                kind: 10 /* Property */,
                label: tag,
                textEdit: { newText: tag, range: range },
            });
        });
        return result;
    }
    function collectTagSuggestions(tagStart, tagEnd) {
        collectOpenTagSuggestions(tagStart, tagEnd);
        return result;
    }
    function collectAttributeNameSuggestions(nameStart, nameEnd = offset) {
        let range = getReplaceRange(nameStart, nameEnd);
        let value = isFollowedBy(text, nameEnd, htmlScanner_1.ScannerState.AfterAttributeName, htmlScanner_1.TokenType.DelimiterAssign) ? '' : '=' + quote + '{{}}' + quote;
        tagProvider.collectAttributes(currentTag, (attribute, type) => {
            let codeSnippet = attribute;
            if (type !== 'v' && value.length) {
                codeSnippet = codeSnippet + value;
            }
            result.items.push({
                kind: type === 'handler' ? 3 /* Function */ : 12 /* Value */,
                label: attribute,
                textEdit: { newText: codeSnippet, range: range },
            });
        });
        return result;
    }
    function collectAttributeValueSuggestions(valueStart, valueEnd) {
        let range;
        let addQuotes;
        if (offset > valueStart && offset <= valueEnd && text[valueStart] === quote) {
            // inside attribute
            if (valueEnd > offset && text[valueEnd - 1] === quote) {
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
            let codeSnippet = addQuotes ? quote + value + quote : value;
            result.items.push({
                filterText: codeSnippet,
                kind: 11 /* Unit */,
                label: value,
                textEdit: { newText: codeSnippet, range: range },
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
        // tslint:disable-next-line:switch-default
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
                    // tslint:disable-next-line:switch-default
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
                    }
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
function isFollowedBy(s, offset, intialState, expectedToken) {
    let scanner = htmlScanner_1.createScanner(s, offset, intialState);
    let token = scanner.scan();
    while (token === htmlScanner_1.TokenType.Whitespace) {
        token = scanner.scan();
    }
    return token === expectedToken;
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