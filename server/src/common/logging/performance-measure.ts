import { performance, PerformanceObserver } from 'perf_hooks';

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
    const duration = this.performance.now();
    this.durationList.push(duration);

    const durationListLength = this.durationList.length;
    let durationDiff = duration;
    if (durationListLength >= 2) {
      durationDiff =
        Number(this.durationList[durationListLength - 1]) -
        Number(this.durationList[durationListLength - 2]);

      const durationFormatted = `${durationDiff / 1000} sec`;
      const label = `Perf: \n >> ${startMarker} << to \n >> ${endMarker} << \n --`;
      const message = `${label}: ${durationFormatted}`;
      console.log(message);
    }

    // this.performance.measure(
    //   `Perf: \n >> ${startMarker} << to \n >> ${endMarker} << \n --`,
    //   startMarker,
    //   endMarker
    // );
  };

  public measureTo = (endMarker: string) => (startMarker: string) => {
    this.measure(startMarker, endMarker);
  };

  public continousMeasuring(message: string): void {
    // this.performance.mark(message);
    this.measureList.push(message);
    console.log(
      'TCL: PerformanceMeasure -> this.measureList',
      this.measureList
    );

    if (this.measureList.length >= 2) {
      const previous = this.measureList[this.measureList.length - 2];

      this.measure(previous, message);
    }
    console.log(
      '------------------------------------------------------------------------------------------'
    );
  }
}

export { performance, PerformanceObserver };
