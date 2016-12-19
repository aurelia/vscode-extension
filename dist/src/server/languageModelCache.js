'use strict';
function getLanguageModelCache(maxEntries, cleanupIntervalTimeInSec, parse) {
    let languageModels = {};
    let nModels = 0;
    let cleanupInterval = void 0;
    if (cleanupIntervalTimeInSec > 0) {
        cleanupInterval = setInterval(() => {
            let cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
            let uris = Object.keys(languageModels);
            for (let uri of uris) {
                let languageModelInfo = languageModels[uri];
                if (languageModelInfo.cTime < cutoffTime) {
                    delete languageModels[uri];
                    nModels--;
                }
            }
        }, cleanupIntervalTimeInSec * 1000);
    }
    return {
        get(document) {
            let version = document.version;
            let languageId = document.languageId;
            let languageModelInfo = languageModels[document.uri];
            if (languageModelInfo && languageModelInfo.version === version && languageModelInfo.languageId === languageId) {
                languageModelInfo.cTime = Date.now();
                return languageModelInfo.languageModel;
            }
            let languageModel = parse(document);
            languageModels[document.uri] = { languageModel, version, languageId, cTime: Date.now() };
            if (!languageModelInfo) {
                nModels++;
            }
            if (nModels === maxEntries) {
                let oldestTime = Number.MAX_VALUE;
                let oldestUri = null;
                for (let uri in languageModels) {
                    if (languageModels.hasOwnProperty(uri)) {
                        // tslint:disable-next-line:no-shadowed-variable
                        let languageModelInfo = languageModels[uri];
                        if (languageModelInfo.cTime < oldestTime) {
                            oldestUri = uri;
                            oldestTime = languageModelInfo.cTime;
                        }
                    }
                }
                if (oldestUri) {
                    delete languageModels[oldestUri];
                    nModels--;
                }
            }
            return languageModel;
        },
        onDocumentRemoved(document) {
            let uri = document.uri;
            if (languageModels[uri]) {
                delete languageModels[uri];
                nModels--;
            }
        },
        dispose() {
            if (typeof cleanupInterval !== 'undefined') {
                clearInterval(cleanupInterval);
                cleanupInterval = void 0;
                languageModels = {};
                nModels = 0;
            }
        },
    };
}
exports.getLanguageModelCache = getLanguageModelCache;
//# sourceMappingURL=languageModelCache.js.map