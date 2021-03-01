export interface IProjectOptions {
  include?: string[];
  exclude?: string[];
  sourceDirectory?: string;
}

export const defaultProjectOptions: IProjectOptions = {
  include: [],
  exclude: [],
  sourceDirectory: '',
};
