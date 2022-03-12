import { StepDefinitions } from 'jest-cucumber';

import { getAureliaComponentInfoFromClassDeclaration } from '../../../server/src/aot/getAureliaComponentList';
import { Optional } from '../../../server/src/core/regions/ViewRegions';
import { IAureliaComponent } from '../../../server/src/core/viewModel/AureliaProgram';
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

  then('the constructor arguments should have been processed correctly', () => {
    expect(targetComponent).toBeDefined();
    if (!targetComponent) return;

    const componentName = 'empty-view';
    expect(targetComponent.componentName).toBe(componentName);
    const expectedClassMemberNames = ['pri', 'pub', 'prot', 'readOnly'];
    const actualNames = targetComponent.classMembers?.map(
      (member) => member.name
    );
    expect(actualNames).toEqual(expectedClassMemberNames);
  });
};
