import { blueBright, bgWhite, bold } from 'colorette';
import { Logger as Culogger } from 'culog';

import { PerformanceMeasure } from './performance-measure';

interface ILogOptions {
  log?: boolean;
  focusedLogging?: boolean;

  measurePerf?: boolean;
  focusedPerf?: boolean;
  logPerf?: boolean;

  /**
   * Indicate to, that log can/should perform a reset
   */
  reset?: boolean;
  highlight?: boolean;
}

const DEFAULT_LOG_OPTIONS: ILogOptions = {
  log: false,
  focusedLogging: true,
  measurePerf: false,
  focusedPerf: true,
  logPerf: false,
  reset: false,
  highlight: false,
};

const performanceMeasure = new PerformanceMeasure();

export class Logger {
  public readonly culogger: Culogger;
  private readonly performanceMeasure?: PerformanceMeasure;

  constructor(
    // eslint-disable-next-line default-param-last
    scope: string = 'Aurelia',
    private readonly options: ILogOptions = DEFAULT_LOG_OPTIONS
  ) {
    this.culogger = new Culogger({ scope });
    // const isJest = __dirname.includes('vscode-extension/server/');
    // const isWallaby =
    //   __dirname.includes('wallabyjs') && __dirname.includes('instrumented');
    // const log = !isJest && !isWallaby;
    // const log = true;

    this.culogger.overwriteDefaultLogOtpions({
      // log,
      logLevel: 'INFO',
      focusedLogging: true,
      // logScope: false,
    });

    if (this.options.measurePerf !== undefined) {
      this.performanceMeasure = performanceMeasure;
    }
  }

  public log(message: string, options?: ILogOptions) {
    const localOptions = {
      ...this.options,
      ...options,
    };

    if (localOptions.measurePerf !== undefined) {
      if (localOptions.focusedPerf !== undefined) {
        if (localOptions.logPerf !== undefined) {
          this.getPerformanceMeasure()?.performance.mark(message);
          this.getPerformanceMeasure()?.continousMeasuring(message, {
            reset: localOptions.reset,
          });
        }
      } else {
        this.getPerformanceMeasure()?.performance.mark(message);
        this.getPerformanceMeasure()?.continousMeasuring(message, {
          reset: localOptions.reset,
        });
      }
    }

    if (localOptions.highlight === true) {
      console.log(
        bold(blueBright(bgWhite('------------ v HIGHLIGHT v ------------')))
      );
    }

    /**
     * Wallaby logic.
     * Wallaby does not console.log from external library.
     */
    this.logMessage(message, options);

    return {
      measureTo: this.getPerformanceMeasure()?.measureTo(message),
    };
  }

  private logMessage(
    message: string,
    options: ILogOptions = DEFAULT_LOG_OPTIONS
  ) {
    const { log } = options;
    const loggedMessage = this.culogger.debug([message], {
      logLevel: 'INFO',
      log,
    });
    if (loggedMessage !== undefined) {
      console.log(loggedMessage[0]);
      if (loggedMessage.length > 1) {
        console.log('There are more log messages');
      }
    }
  }

  public getPerformanceMeasure() {
    if (
      this.options.measurePerf !== undefined &&
      this.performanceMeasure === undefined
    ) {
      throw new Error(
        'Performance measuring not active. To acitve set this.optinos.measuerPerf = true.'
      );
    }

    return this.performanceMeasure;
  }
}
