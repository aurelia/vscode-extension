import { Disposable } from 'vscode';

export default function using<T extends Disposable>(resource: T, func: (resource: T) => void) {
  try {
    func(resource);
  } finally {
    resource.dispose();
  }
}
