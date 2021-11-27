import { StepDefinitions } from 'jest-cucumber';

import { isAureliaCompletionItem } from '../../../../server/src/feature/completions/virtualCompletion';
import { completions } from '../completions.spec';

export const completionValueConverterSteps: StepDefinitions = ({ then }) => {
  then('I should get the correct Value converters suggestions', () => {
    if (isAureliaCompletionItem(completions)) {
      const valueConverterName = 'sort';
      const target = completions.find(
        (completion) => completion.detail === valueConverterName
      );

      expect(target?.detail).toBe(valueConverterName);
      expect(target?.label).toContain('(Au VC)');
    }
  });
};
