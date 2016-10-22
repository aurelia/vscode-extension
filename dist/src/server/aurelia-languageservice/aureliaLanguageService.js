"use strict";
const htmlParser_1 = require('./parser/htmlParser');
const htmlCompletion_1 = require('./services/htmlCompletion');
function getLanguageService() {
    return {
        doComplete: htmlCompletion_1.doComplete,
        parseHTMLDocument: document => htmlParser_1.parse(document.getText()),
    };
}
exports.getLanguageService = getLanguageService;
//# sourceMappingURL=aureliaLanguageService.js.map