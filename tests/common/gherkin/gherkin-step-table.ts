export type StepTable<HeaderName extends string = ''> = Record<
  HeaderName,
  string
>[];

export type FileNameStepTable = StepTable<'fileName'>;

export function getTableValues(stepTable: StepTable<any>): string[] {
  const values = stepTable.flatMap(Object.values);
  return values;
}
