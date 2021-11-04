import { StepDefinitions } from 'jest-cucumber';

import { Optional } from '../../../server/src/core/regions/ViewRegions';
import { IAureliaComponent } from '../../../server/src/core/viewModel/AureliaProgram';
import { getAureliaComponentInfoFromClassDeclaration } from '../../../server/src/core/viewModel/getAureliaComponentList';
import { myMockServer } from '../capabilities/new-common/project.step';

export const IAureliaComponentSteps: StepDefinitions = ({ when, then }) => {
  let targetComponent: Optional<IAureliaComponent, 'viewRegions'> | undefined;

  when('I call AureliaComponents#init', () => {
    const mockProgram = myMockServer.createMockProgram();
    const program = mockProgram.get();
    const sourceFile = mockProgram.getSourceFile();
    if (!sourceFile) return;

    targetComponent = getAureliaComponentInfoFromClassDeclaration(
      sourceFile,
      program.getTypeChecker()
    );
  });

  then('the correct view model name should be returned', () => {
    const componentName = 'custom-element';
    const startOffset = 24;
    // targetComponent; /*?*/
    expect(targetComponent).toBeDefined();
    if (!targetComponent) return;

    expect(targetComponent.componentName).toBe(componentName);
    expect(targetComponent.decoratorComponentName).toBe(componentName);
    expect(targetComponent.decoratorStartOffset).toBe(24);
    expect(targetComponent.decoratorEndOffset).toBe(
      startOffset + componentName.length + 1
    );
  });
};
