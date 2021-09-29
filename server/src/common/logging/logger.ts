import { Logger as Culogger } from 'culog';
import { PerformanceMeasure } from './performance-measure';
import { blueBright, bgWhite, bold, underline } from 'colorette';

interface ILogOptions {
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
  measurePerf: true,
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
    scope: string = 'Aurelia',
    private readonly options: ILogOptions = DEFAULT_LOG_OPTIONS
  ) {
    this.culogger = new Culogger({ scope });
    const isJest = __dirname.includes('vscode-extension/server/');
    const isWallaby =
      __dirname.includes('wallabyjs') && __dirname.includes('instrumented');
    const log = !isJest && !isWallaby;
    // const log = true;

    this.culogger.overwriteDefaultLogOtpions({
      // log,
      logLevel: 'INFO',
      focusedLogging: true,
      // logScope: false,
    });

    if (this.options.measurePerf) {
      this.performanceMeasure = performanceMeasure;
    }
  }

  log(message: string, options?: ILogOptions) {
    const localOptions = {
      ...this.options,
      ...options,
    };

    if (localOptions.measurePerf) {
      if (localOptions.focusedPerf) {
        if (localOptions.logPerf) {
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

    if (localOptions.highlight) {
      console.log(
        bold(blueBright(bgWhite('------------ v HIGHLIGHT v ------------')))
      );
    }

    /**
     * Wallaby logic.
     * Wallaby does not console.log from external library.
     */
    const loggedMessage = this.culogger.debug([message], { logLevel: 'INFO' });
    if (loggedMessage) {
      console.log(loggedMessage[0]);
      if (loggedMessage.length > 1) {
        console.log('There are more log messages');
      }
    }

    return {
      measureTo: this.getPerformanceMeasure()?.measureTo(message),
    };
  }

  getPerformanceMeasure() {
    if (this.options.measurePerf && this.performanceMeasure === undefined) {
      throw new Error(
        'Performance measuring not active. To acitve set this.optinos.measuerPerf = true.'
      );
    }

    return this.performanceMeasure;
  }
}
