import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import { cliGenerateSteps } from './step-definitions/initialization/on-initialized/on-initialized.spec';

const features = loadFeatures('**/*.feature');
autoBindSteps(features, [cliGenerateSteps]);
