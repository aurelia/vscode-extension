/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as path from 'path';

import { blueBright, bgWhite, bold } from 'colorette';
import { Logger as Culogger, LogOptions } from 'culog';

import { PerformanceMeasure, performance } from './performance-measure';
import { prettifyCallstack, remapWallabyToNormalProject } from './WallabyUtils';

const DEV_IS_WALLABY = __dirname.includes('wallabyjs.wallaby-vscode');

type Environment = 'prod' | 'dev' | 'test';

interface ILogOptions extends LogOptions {
  log?: boolean;
  focusedLogging?: boolean;
  ignoreFirstXLogs?: number;
  ignoreAfterXLogs?: number;

  measurePerf?: boolean;
  focusedPerf?: boolean;
  logPerf?: boolean;

  /** Log ms to last call of `logMs`. Ms = milliseconds */
  shouldLogMs?: boolean;
  logMs?: boolean;
  msStart?: boolean;
  msEnd?: boolean;

  env?: Environment;
  reset?: boolean;
  highlight?: boolean;

  projectPath?: string;
}

const isCI = Boolean(process.env.CI);
const shouldLog = !isCI;
const DEFAULT_LOG_OPTIONS: ILogOptions = {
  log: shouldLog,
  focusedLogging: true,
  ignoreFirstXLogs: 7,
  // ignoreAfterXLogs: 1,

  measurePerf: true,
  focusedPerf: true,
  logPerf: false,

  shouldLogMs: true,

  env: 'prod',
  reset: false,
  highlight: false,

  projectPath: '',
};

const performanceMeasure = new PerformanceMeasure();
let ignoreLogCount = 0;

export class Logger {
  public readonly culogger: Culogger;
  private readonly performanceMeasure?: PerformanceMeasure;

  private msStartTime: number;
  private msEndTime: number;

  constructor(
    // eslint-disable-next-line default-param-last
    scope: string = 'Aurelia',
    private readonly classOptions: ILogOptions = DEFAULT_LOG_OPTIONS
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

    if (this.classOptions.measurePerf === true) {
      this.performanceMeasure = performanceMeasure;
    }
  }

  public log(message: string, options?: ILogOptions) {
    const localOptions = {
      ...this.classOptions,
      ...options,
    };
    let finalMessage = message;

    // region measure perf
    if (localOptions.measurePerf === true) {
      if (localOptions.focusedPerf === true) {
        if (localOptions.logPerf === true) {
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
    // endregion measure perf

    if (localOptions.highlight === true) {
      console.log(
        bold(blueBright(bgWhite('------------ v HIGHLIGHT v ------------')))
      );
    }

    if (localOptions.env !== this.classOptions.env) return;

    // region ignore
    if (
      localOptions.ignoreFirstXLogs != null &&
      localOptions.ignoreAfterXLogs != null
    ) {
      const ignoreFirst = ignoreLogCount >= localOptions.ignoreFirstXLogs;
      const ignoreAfter = ignoreLogCount < localOptions.ignoreAfterXLogs;
      const shouldIgnore = !(ignoreFirst && ignoreAfter);

      ignoreLogCount++;

      if (shouldIgnore) {
        return;
      }
    }

    // Log count
    if (
      localOptions.ignoreFirstXLogs != null &&
      ignoreLogCount < localOptions.ignoreFirstXLogs
    ) {
      ignoreLogCount++;
      return;
    }
    // endregion ignore

    // region measure ms
    if (localOptions.shouldLogMs === true) {
      if (localOptions.msStart === true) {
        this.msStartTime = performance.now();
      } else if (localOptions.msEnd === true) {
        this.msEndTime = performance.now();
        let duration = this.msEndTime - this.msStartTime;
        duration = Math.round(duration * 10) / 10;
        finalMessage = `${finalMessage} (took ${duration} ms)`;
      }
    }
    // endregion measure ms

    /**
     * Wallaby logic.
     * Wallaby does not console.log from external library.
     */
    this.logMessage(finalMessage, localOptions);
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

    // Below this guard only for development with wallaby.
    if (DEV_IS_WALLABY) {
      if (loggedMessage !== undefined) {
        const logSource = findLogSource();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let finalMessage = loggedMessage[0];
        if (options.env !== 'prod') {
          finalMessage = `${loggedMessage[0]} (at ${logSource})`;
        }

        console.log(finalMessage);

        if (loggedMessage.length > 1) {
          console.log('There are more log messages');
        }
      }
    }
  }

  public stack() {
    const errorStack = new Error().stack;
    if (errorStack == null) return;

    const [, ...errorTrace] = errorStack.split('\n');
    const withOutLogger = errorTrace.filter(
      (line) => !line.includes(path.normalize('logging/logger.'))
    );

    // errorSplit.slice(4, 25).join('\n'); /* ? */
    const stack = prettifyCallstack(withOutLogger);
    console.log(stack.rawToTrackerList);
  }

  public getPerformanceMeasure() {
    if (
      this.classOptions.measurePerf !== undefined &&
      this.performanceMeasure === undefined
    ) {
      throw new Error(
        'Performance measuring not active. To activate set this.optinos.measurePerf = true.'
      );
    }

    return this.performanceMeasure;
  }
}

/**
 * Assumption:
 *   1. logger.log (source)
 *   2. logger.logMessage
 *   3. findLogSource (this function)
 *   4. Error (from new Error().stack format)
 */
function findLogSource() {
  const errorStack = new Error().stack;
  if (errorStack == null) return;

  const [_error, ...errorTrace] = errorStack.split('\n');
  const withOutLogger = errorTrace.filter(
    (line) => !line.includes(path.normalize('logging/logger.'))
  );
  // errorSplit.slice(4, 25).join('\n'); /* ? */
  // prettifyCallstack(withOutLogger);

  // const [_errorWord, _findLogSource, _LoggerLogMessage, _LoggerLog, rawTarget] =
  const rawTarget = withOutLogger.map((str) => str.trim());
  const rawSplit = rawTarget[0].split(' ');
  /** Path could have space, thus we join those */
  let targetPath = rawSplit[rawSplit.length - 1];
  if (rawSplit.length >= 4) {
    const [_at, _caller, ...pathToJoin] = rawSplit;
    targetPath = pathToJoin.join(' ');
  }

  let sourceName = path.basename(targetPath);
  if (sourceName.endsWith(')')) {
    sourceName = sourceName.replace(/\)$/, '');
  }

  if (DEV_IS_WALLABY) {
    try {
      const remapped = remapWallabyToNormalProject(targetPath);
      if (typeof remapped !== 'string') {
        return remapped.remappedLine;
        // return remapped.remappdeLocation;
      }
      // eslint-disable-next-line no-empty
    } catch (_error) {}
  }

  return sourceName;
}

export const defaultLogger = new Logger('defaultLogger');
