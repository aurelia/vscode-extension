import {workspace} from "vscode";
import {AureliaConfigProperties} from "./Model/AureliaConfigProperties";

export function getFileExtensionsFromConfig(wp: typeof workspace): AureliaConfigProperties['relatedFiles'] {
  const defaultSettings = {
    script: '.js',
    style: '.less',
    unit: '.spec.js',
    view: '.html',
  };
  return wp.getConfiguration().get<AureliaConfigProperties['relatedFiles']>('aurelia.relatedFiles', defaultSettings);
}
