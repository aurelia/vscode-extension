export type StepTable<HeaderName extends string = ''> = Record<
  HeaderName,
  string
>[];

export type FileNameStepTable = StepTable<'fileName'>;

export function getTableValues(stepTable: StepTable<unknown>): string[] {
  const values = stepTable.flatMap(Object.values) as string[];
  return values;
}
