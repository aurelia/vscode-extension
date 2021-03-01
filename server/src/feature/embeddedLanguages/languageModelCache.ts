import { TextDocument } from 'vscode-html-languageservice';

export interface LanguageModelCache<T> {
  get(document: TextDocument): T;
  onDocumentRemoved(document: TextDocument): void;
  dispose(): void;
}

export function getLanguageModelCache<T>(
  maxEntries: number,
  cleanupIntervalTimeInSec: number,
  parse: (document: TextDocument) => Promise<T>
): LanguageModelCache<Promise<T>> {
  let languageModels: {
    [uri: string]: {
      version: number;
      languageId: string;
      cTime: number;
      languageModel: T;
    };
  } = {};
  let nModels = 0;

  let cleanupInterval: NodeJS.Timer | undefined;
  if (cleanupIntervalTimeInSec > 0) {
    cleanupInterval = setInterval(() => {
      const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
      const uris = Object.keys(languageModels);
      for (const uri of uris) {
        const languageModelInfo = languageModels[uri];
        if (languageModelInfo.cTime < cutoffTime) {
          delete languageModels[uri];
          nModels--;
        }
      }
    }, cleanupIntervalTimeInSec * 1000);
  }

  return {
    async get(document: TextDocument): Promise<T> {
      const version = document.version;
      const languageId = document.languageId;
      const languageModelInfo = languageModels[document.uri];
      if (
        languageModelInfo &&
        languageModelInfo.version === version &&
        languageModelInfo.languageId === languageId
      ) {
        languageModelInfo.cTime = Date.now();
        return languageModelInfo.languageModel;
      }
      const languageModel = await parse(document);
      languageModels[document.uri] = {
        languageModel,
        version,
        languageId,
        cTime: Date.now(),
      };
      if (!languageModelInfo) {
        nModels++;
      }

      if (nModels === maxEntries) {
        let oldestTime = Number.MAX_VALUE;
        let oldestUri = null;
        for (const uri in languageModels) {
          const languageModelInfo = languageModels[uri];
          if (languageModelInfo.cTime < oldestTime) {
            oldestUri = uri;
            oldestTime = languageModelInfo.cTime;
          }
        }
        if (oldestUri) {
          delete languageModels[oldestUri];
          nModels--;
        }
      }
      return languageModel;
    },
    onDocumentRemoved(document: TextDocument) {
      const uri = document.uri;
      if (languageModels[uri]) {
        delete languageModels[uri];
        nModels--;
      }
    },
    dispose() {
      if (typeof cleanupInterval !== 'undefined') {
        clearInterval(cleanupInterval);
        cleanupInterval = undefined;
        languageModels = {};
        nModels = 0;
      }
    },
  };
}
