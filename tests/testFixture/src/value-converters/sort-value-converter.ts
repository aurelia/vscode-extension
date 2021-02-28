class SortError extends Error {
  constructor() {
    super();
  }
}

interface Config {
  propertyName: string;
  direction: string;
}

export class SortValueConverter {
  toView(array: string[], config: Config, solution: number) {
    let factor = (config.direction || "ascending") === "ascending" ? 1 : -1;
    return array.sort((a, b) => {
      return (a[config.propertyName] - b[config.propertyName]) * factor;
    });
  }
}
