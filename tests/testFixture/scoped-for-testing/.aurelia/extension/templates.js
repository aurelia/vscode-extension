function createViewModelTemplate({
  bindableImportPackage,
  className,
  asBindablesCode,
  collectedClassMembers
}) {
  return `import { bindable } from '${bindableImportPackage}';

export class ${className} {
  ${asBindablesCode}
}
`;
}

function createViewTemplate({ selectedTexts, isAuV1 }) {
  const content = selectedTexts.join('\n');
  const surroundWithTemplate = isAuV1
    ? `<template>\n  ${content}\n</template>`
    : content;
  return surroundWithTemplate;
}

module.exports = {
  createViewModelTemplate,
  createViewTemplate,
};
