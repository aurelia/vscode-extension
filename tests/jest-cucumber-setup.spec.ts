import { Container } from 'aurelia-dependency-injection';
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { MockServer } from './common/mock-server/mock-server';
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

export const testContainer = new Container();

const features = loadFeatures('**/*.feature', {
  tagFilter: '@focus',
  // scenarioNameTemplate: (vars) => {
  // return `${vars.featureTitle} - ${vars.scenarioTitle}`;
  // },
});
autoBindSteps(features, [
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
]);
