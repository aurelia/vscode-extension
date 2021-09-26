import { Container } from 'aurelia-dependency-injection';
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { Logger } from '../server/src/common/logging/logger';
import { commonCapabilitiesStep } from './step-definitions/capabilities/common/common-capabilities.spec';
import { completionSteps } from './step-definitions/capabilities/completions.spec';
import { completionValueConverterSteps } from './step-definitions/capabilities/completions/completions-value-converters.spec';
import { definitionSteps } from './step-definitions/capabilities/definitions.spec';
import { hoverSteps } from './step-definitions/capabilities/hover/hover.spec';
import { contentChangeSteps } from './step-definitions/content/content-change.spec';
import // cliGenerateSteps,
// commonExtensionSteps,
'./step-definitions/initialization/on-initialized/detecting-on-init.spec';
import { hydrateSteps } from './step-definitions/initialization/on-initialized/hydrate-on-init.spec';
import { performance, PerformanceObserver } from 'perf_hooks';

export const testContainer = new Container();
// const logger = new Logger('[Test] Detecting');

// export const perfObs = new PerformanceObserver((items) => {
//   const entry = items.getEntries()[0];
//   const duration = `${entry.duration / 1000} sec`;
//   const message = `${entry.name}: ${duration}`;
//   console.log('TCL: message', message);
//   performance.clearMarks();
// });
// perfObs.observe({ entryTypes: ['measure'] });

// performance.mark('before loadfeature');
// const features = loadFeatures('**/completions.feature', {
//   tagFilter: '@focus',
//   // scenarioNameTemplate: (vars) => {
//   // return `${vars.featureTitle} - ${vars.scenarioTitle}`;
//   // },
// });
// performance.mark('after loadfeature');
// performance.measure('okay', 'before loadfeature', 'after loadfeature');
// autoBindSteps(features, [
//   cliGenerateSteps,
//   commonExtensionSteps,
//   hydrateSteps,
//   // content
//   contentChangeSteps,
//   // capabilities
//   commonCapabilitiesStep,
//   // definitionSteps,
//   completionSteps,
//   // completionValueConverterSteps,
//   // hoverSteps,
// ]);
