import { defineFeature, loadFeature, StepDefinitions } from 'jest-cucumber';

const feature = loadFeature('./minimal-jest/minimal.feature');

defineFeature(feature, (test) => {
  test('Mini Scenario', ({ given, then }) => {
    given('Minimal', () => {
      /* prettier-ignore */ console.log('TCL: minimalSteps:StepDefinitions -> Minimal')
    });
    then('really', () => {
      /* prettier-ignore */ console.log('TCL: minimalSteps:StepDefinitions -> really')
    });
  });
});

export const minimalSteps: StepDefinitions = ({ given, then }) => {
  given('Minimal', () => {
    /* prettier-ignore */ console.log('TCL: minimalSteps:StepDefinitions -> Minimal')
  });
  then('really', () => {
    /* prettier-ignore */ console.log('TCL: minimalSteps:StepDefinitions -> really')
  });
};
