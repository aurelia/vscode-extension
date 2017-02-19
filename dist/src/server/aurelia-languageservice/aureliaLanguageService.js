"use strict";
const htmlParser_1 = require("./parser/htmlParser");
const htmlCompletion_1 = require("./services/htmlCompletion");
const htmlValidation_1 = require("./services/htmlValidation");
function getLanguageService() {
    const validation = new htmlValidation_1.HTMLValidation();
    return {
        doComplete: htmlCompletion_1.doComplete,
        doValidation: validation.doValidation.bind(validation),
        parseHTMLDocument: document => htmlParser_1.parse(document.getText()),
    };
}
exports.getLanguageService = getLanguageService;
//# sourceMappingURL=aureliaLanguageService.js.map