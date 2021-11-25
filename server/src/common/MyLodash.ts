// @ts-nocheck

export class MyLodash {
  /** https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises */
  public static debouncePromise(inner, ms = 0) {
    let timer = null;
    let resolves = [];

    return function (...args) {
      // Run the function after a certain amount of time
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Get the result of the inner function, then apply it to the resolve function of
        // each promise that has been created since the last time the inner function was run
        const result = inner(...args);
        resolves.forEach((r) => r(result));
        resolves = [];
      }, ms);

      return new Promise((r) => resolves.push(r));
    };
  }

  /** https://gist.github.com/nmsdvid/8807205#gistcomment-3939848 */
  public static debounce<T>(func: (...args: T[]) => unknown, delay = 200) {
    let timeout: number | NodeJS.Timeout;

    return function (...args: T[]) {
      clearTimeout(timeout as number);
      timeout = setTimeout(() => func(...args), delay);
    };
  }
}
