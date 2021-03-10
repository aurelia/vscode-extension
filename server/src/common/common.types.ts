export interface IProjectOptions {
  include?: string[];
  exclude?: string[];
  rootDirectory?: string;
}

export const defaultProjectOptions: IProjectOptions = {
  include: [],
  exclude: [],
  rootDirectory: '',
};
