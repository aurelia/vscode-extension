import { performance, PerformanceObserver } from 'perf_hooks';

const CONSIDER_THRESHOLD = true;
// const DUARTION_THRESHOLD = 0;
const DUARTION_THRESHOLD = 100;

interface IPerformanceMeasureOptions {
  reset?: boolean;
}

export class PerformanceMeasure {
  public performance = performance;
  public measureList: string[] = [];

  private durationList: number[] = [];
  private perfObs: PerformanceObserver;

  constructor() {
    this.initPerfObs();
  }

  public initPerfObs() {
    // this.perfObs = new PerformanceObserver((items, observer) => {
    //   const entry = items.getEntries()[0];
    //   const { duration } = entry;
    //   this.durationList.push(duration);
    //   const durationListLength = this.durationList.length;
    //   let durationDiff = duration;
    //   if (durationListLength >= 2) {
    //     durationDiff =
    //       Number(this.durationList[durationListLength - 1]) -
    //       Number(this.durationList[durationListLength - 2]);
    //   }
    //   const durationFormatted = `${durationDiff / 1000} sec`;
    //   const message = `${entry.name}: ${durationFormatted}`;
    //   console.log(message);
    //   this.performance.clearMarks();
    //   // observer.disconnect();
    // });
    // this.perfObs.observe({ entryTypes: ['measure'] });
  }

  public getPerfObs(): PerformanceObserver {
    return this.perfObs;
  }

  public measure = (startMarker: string, endMarker: string) => {
    const currentTime = this.performance.now();
    this.durationList.push(currentTime);
    const durationListLength = this.durationList.length;

    let durationDiff = currentTime;
    let preLabel = '';
    let startIndex = NaN;
    let endIndex = NaN;

    switch (durationListLength) {
      case 1: {
        console.log('>>>>>>>>>>>');
        startIndex = -1;
        endIndex = 0;
        preLabel = `Time to first measure for`;
        break;
      }
      default: {
        startIndex = durationListLength - 2;
        endIndex = durationListLength - 1;
        const prevTime = Number(this.durationList[startIndex]);
        const curTime = Number(this.durationList[endIndex]);
        durationDiff = curTime - prevTime;

        preLabel = 'Perf';
        break;
      }
    }

    if (CONSIDER_THRESHOLD && durationDiff < DUARTION_THRESHOLD) {
      return;
    }

    const durationFormatted = `${durationDiff / 1000} sec`;
    const startIndexLabel = `(${startIndex + 1}.) -`;
    const endIndexLabel = `(${endIndex + 1}.) -`;
    const makerNamesLabel = `\n >> ${startIndexLabel} ${startMarker} << \n >> ${endIndexLabel} ${endMarker} << \n >>`;
    const label = `${preLabel}: ${makerNamesLabel}`;
    const message = `${label} ${durationFormatted}`;
    console.log(message);
    console.log(
      '-----------------------------------------------------------------------'
    );
  };

  public measureTo = (endMarker: string) => (startMarker: string) => {
    this.measure(startMarker, endMarker);
  };

  public continousMeasuring(
    message: string,
    options?: IPerformanceMeasureOptions
  ): void {
    if (options?.reset) {
      this.measureList = [];
      this.durationList = [];
    }
    this.measureList.push(message);

    if (this.measureList.length >= 2) {
      const previous = this.measureList[this.measureList.length - 2];

      this.measure(previous, message);
    }
  }
}

export { performance, PerformanceObserver };
