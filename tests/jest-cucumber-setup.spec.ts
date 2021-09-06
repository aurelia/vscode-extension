import { Container } from 'aurelia-dependency-injection';
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { MockServer } from './common/mock-server';
import { contentChangeSteps } from './step-definitions/content/content-change.spec';
import {
  cliGenerateSteps,
  commonExtensionSteps,
} from './step-definitions/initialization/on-initialized/detecting-on-init.spec';
import { hydrateSteps } from './step-definitions/initialization/on-initialized/hydrate-on-init.spec';

export const testContainer = new Container();
testContainer.registerInstance(MockServer, new MockServer(testContainer));

const features = loadFeatures('**/*.feature', {
  tagFilter: '@focus',
});
autoBindSteps(features, [
  cliGenerateSteps,
  commonExtensionSteps,
  hydrateSteps,
  // content
  contentChangeSteps,
]);
