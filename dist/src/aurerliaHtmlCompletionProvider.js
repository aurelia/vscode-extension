"use strict";
const aureliaHtmlCompletionOptionsFactory_1 = require('./aureliaHtmlCompletionOptionsFactory');
class AurerliaHtmlCompletionProvider {
    provideCompletionItems(document, position, token) {
        let stringToValidate = document.lineAt(position).text.substring(0, position.character);
        let matchResult = AurerliaHtmlCompletionProvider.regex.exec(stringToValidate);
        if (matchResult.length > 1) {
            return aureliaHtmlCompletionOptionsFactory_1.default.getForAttribute(matchResult[1]);
        }
        return [];
    }
}
AurerliaHtmlCompletionProvider.regex = /([a-zA-Z0-9:-]+)\.$/;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AurerliaHtmlCompletionProvider;
//# sourceMappingURL=aurerliaHtmlCompletionProvider.js.map