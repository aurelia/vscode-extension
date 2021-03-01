/** https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
