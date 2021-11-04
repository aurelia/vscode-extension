export type StepTable<HeaderName extends string = ''> = Record<
  HeaderName,
  string
>[];

export type FileNameStepTable = StepTable<'fileName'>;

export function getTableValues(stepTable: StepTable<string>): string[] {
  const values = stepTable.flatMap(Object.values) as string[];
  return values;
}
