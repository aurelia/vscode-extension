import { Container } from 'aurelia-dependency-injection';
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { ParsedFeature } from 'jest-cucumber/dist/src/models';

import {
  createFeatureCache,
  readFeatureCache,
} from './dev-test-helpers/cache-cucumber-features';
import { minimalSteps } from './minimal-jest/minimal.spec';
import { codeActionSteps } from './step-definitions/capabilities/codeAction/codeAction.spec';
import { commonCapabilitiesStep } from './step-definitions/capabilities/common/common-capabilities.spec';
import { completionSteps } from './step-definitions/capabilities/completions.spec';
import { completionValueConverterSteps } from './step-definitions/capabilities/completions/completions-value-converters.spec';
import { definitionSteps } from './step-definitions/capabilities/definitions.spec';
import { diagnosticsSteps } from './step-definitions/capabilities/diagnostics/diagnostics.spec';
import { hoverSteps } from './step-definitions/capabilities/hover/hover.spec';
import { renameSteps } from './step-definitions/capabilities/rename/rename.spec';
import { symbolSteps } from './step-definitions/capabilities/symbols/documentSymbols.spec';
import { contentChangeSteps } from './step-definitions/content/content-change.spec';
import { IAureliaComponentSteps } from './step-definitions/core/AureliaComponents.spec';
import { AureliaProjectsSteps } from './step-definitions/core/AureliaProjects.spec';
import {
  cliGenerateSteps,
  commonExtensionSteps,
} from './step-definitions/initialization/on-initialized/detecting-on-init.spec';
import { hydrateSteps } from './step-definitions/initialization/on-initialized/hydrate-on-init.spec';

//

export const testContainer = new Container();
// const logger = new Logger('[Test] Detecting');
const useCache = false;

export function initCucumberTests(tagFilter: string = '@focus'): void {
  let features: ParsedFeature[] | undefined;
  if (useCache) {
    features = readFeatureCache();
  } else {
    features = loadFeatures('**/features/**/*.feature', {
      tagFilter,
      // tagFilter: '@focus',
      // tagFilter: '@cli_generated or @scoped_for_testing or @monorepo', // <<<
      // scenarioNameTemplate: (vars) => {
      //   return `${vars.featureTitle} - ${vars.scenarioTitle}`;
      // },
    });
    createFeatureCache(features);
  }

  if (!features) return;

  autoBindSteps(features, [
    minimalSteps,
    cliGenerateSteps,
    commonExtensionSteps,
    // core
    AureliaProjectsSteps,
    IAureliaComponentSteps,
    //
    hydrateSteps,
    // content
    contentChangeSteps,
    // capabilities
    codeActionSteps,
    commonCapabilitiesStep,
    definitionSteps,
    diagnosticsSteps,
    completionSteps,
    completionValueConverterSteps,
    symbolSteps,
    hoverSteps,
    renameSteps,
  ]);
}
