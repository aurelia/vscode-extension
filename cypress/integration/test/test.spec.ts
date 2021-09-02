import { Feature, IGherkinTableParam } from 'fermenter';
import { ok, strictEqual } from 'assert';
import { jest } from '@jest/globals';

const getNumbers = (state: {} = {}, a: number, b: number) => {
  return {
    ...state,
    a,
    b,
  };
};

const addNumbers = (state: { a: number; b: number }) => {
  const { a, b } = state;

  return {
    ...state,
    c: a + b,
  };
};

const subtractNumbers = (state: { a: number; b: number }) => {
  const { a, b } = state;

  return {
    ...state,
    c: a - b,
  };
};

const multiplyNumbers = (state: { a: number; b: number }) => {
  const { a, b } = state;

  return {
    ...state,
    c: a * b,
  };
};

const checkResult = ({ c }: { c: number }, expected: number) => {
  strictEqual(c, expected);
};

const afterAllFn = jest.fn();
const beforeAllFn = jest.fn();
const beforeEachFn = jest.fn();
const afterEachFn = jest.fn();

/** Here we wrap `Feature` and give it the global variables mocha provides as test methods */
// export const MochaFeature = (...args: Parameters<typeof Feature>) =>
//   Feature(
//     {
//       methods: { test, describe, afterAll: after, beforeAll: before },
//       ...args[0],
//     },
//     args[1]
//   );

Feature('../on-initialized.feature', () => {
  // expect(1).toBe(1);
  strictEqual(1, 1);
});

Feature(
  {
    feature: '../on-initialized.feature',
  },
  ({
    Scenario,
    Background,
    ScenarioOutline,
    AfterAll,
    BeforeAll,
    AfterEach,
    BeforeEach,
  }) => {
    Background('Calculator').Given('I can calculate', () => {
      ok(Math);
    });

    Scenario('A simple addition test')
      .Given(
        'I have the following numbers:',
        (state = {}, table: IGherkinTableParam) => {
          const [{ a, b }] = table.rows.mapByTop();

          return {
            ...state,
            a: parseInt(a, 10),
            b: parseInt(b, 10),
          };
        }
      )
      .When('I add the numbers', addNumbers)
      .And('I do nothing', (state) => state)
      .Then('I get', (state, text: string) => {
        // expect(state.c).toBe(parseInt(text, 10));
        strictEqual(state.c, parseInt(text, 10));
      });

    Scenario.skip('A simple multiplication test')
      .Given(/^I have numbers (\d+) and (\d+)$/, getNumbers)
      .When('I multiply the numbers', multiplyNumbers)
      .Then('I get {int}', checkResult);

    ScenarioOutline('A simple subtraction test')
      .Given('I have numbers {int} and {int}', getNumbers)
      .When('I subtract the numbers', subtractNumbers)
      .Then('I get {int}', checkResult);

    AfterAll(afterAllFn);
    BeforeAll(beforeAllFn);
    BeforeEach(beforeEachFn);
    AfterEach(afterEachFn);
  }
);

// it('runs a Feature', () => {
// const expectedAfterAllCalls = 1;

// // Wait for the tests to be run
// while (afterAllFn.mock.calls.length < expectedAfterAllCalls) { /**/ }

// expect(afterAllFn).toHaveBeenCalledTimes(expectedAfterAllCalls);
// expect(beforeAllFn).toHaveBeenCalledTimes(1);
// expect(beforeEachFn).toHaveBeenCalledTimes(3);
// expect(afterEachFn).toHaveBeenCalledTimes(3);
// }, 10000);
