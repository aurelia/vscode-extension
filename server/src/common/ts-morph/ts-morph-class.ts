import { ClassDeclaration, SourceFile, SyntaxKind } from 'ts-morph';

export function getClass(
  sourceFile: SourceFile | undefined,
  className: string
) {
  if (!sourceFile) throw new Error('No Source file');

  const classNode = sourceFile.getClass(className)!;
  return classNode;
}

/**
 * @example
 *   getClassMember(sourceFile, 'foo')
 */
export function getClassMember(classNode: ClassDeclaration, name: string) {
  classNode.getFirstDescendantByKind(SyntaxKind.Identifier)?.getText();
  const target = classNode
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .find((descendant) => {
      descendant.getText();
      return descendant.getText() === name;
    });

  return target;
}
