import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import {
  cliGenerateSteps,
  nonAureliaProjectSteps,
} from './step-definitions/initialization/on-initialized/on-initialized.spec';

const features = loadFeatures('**/*.feature', {
  tagFilter: '@focus',
});
autoBindSteps(features, [cliGenerateSteps, nonAureliaProjectSteps]);
