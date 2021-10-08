import { Container } from 'aurelia-dependency-injection';
import { loadFeatures, autoBindSteps } from 'jest-cucumber';

import { Logger } from '../server/src/common/logging/logger';
import {
  createFeatureCache,
  readFeatureCache,
  resetFeatureCache,
} from './dev-test-helpers/cache-cucumber-features';
import { commonCapabilitiesStep } from './step-definitions/capabilities/common/common-capabilities.spec';
import { completionSteps } from './step-definitions/capabilities/completions.spec';
import { completionValueConverterSteps } from './step-definitions/capabilities/completions/completions-value-converters.spec';
import { definitionSteps } from './step-definitions/capabilities/definitions.spec';
import { hoverSteps } from './step-definitions/capabilities/hover/hover.spec';
import { contentChangeSteps } from './step-definitions/content/content-change.spec';
import {
  cliGenerateSteps,
  commonExtensionSteps,
} from './step-definitions/initialization/on-initialized/detecting-on-init.spec';
import { hydrateSteps } from './step-definitions/initialization/on-initialized/hydrate-on-init.spec';
import { renameSteps } from './step-definitions/capabilities/rename/rename.spec';
import { minimalSteps } from './minimal-jest/minimal.spec';

//

export const testContainer = new Container();
const logger = new Logger('[Test] Detecting');

resetFeatureCache();
function init() {
  // logger.log('before test', { logPerf: true });
  // logger.log('after test', { logPerf: true });

  // logger.log('before loadfeature', { logPerf: true });
  let features = readFeatureCache();
  if (!features) {
    /* refactoring steps: rename */
    // features = loadFeatures('**/features/**/!(rename)/*.feature', {
    features = loadFeatures('**/features/**/*.feature', {
      // tagFilter: '@focus',
      // tagFilter: '@scoped_for_testing',
      tagFilter: '@cli_generated or @scoped_for_testing or @monorepo',
      // tagFilter: '(@cli_generated or @scoped_for_testing) and @focus',
      // tagFilter: '(@cli_generated and @focus) or (@scoped_for_testing and @focus)',
      // tagFilter: '@cli_generated and  @focus',
      // scenarioNameTemplate: (vars) => {
      // return `${vars.featureTitle} - ${vars.scenarioTitle}`;
      // },
    });
    createFeatureCache(features);
  }
  // logger.log('after loadfeature', { logPerf: true });

  autoBindSteps(features, [
    minimalSteps,
    cliGenerateSteps,
    commonExtensionSteps,
    hydrateSteps,
    // content
    contentChangeSteps,
    // capabilities
    commonCapabilitiesStep,
    definitionSteps,
    completionSteps,
    completionValueConverterSteps,
    hoverSteps,
    renameSteps,
  ]);
}

init();
