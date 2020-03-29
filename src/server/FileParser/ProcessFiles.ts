import { Range, Position } from 'vscode-languageserver';
import * as Path from 'path';
import {
  Node, SyntaxKind, SourceFile, createSourceFile, ScriptTarget, ScriptKind,
  forEachChild, ClassDeclaration, PropertyDeclaration, MethodDeclaration, sys
} from "typescript";

import { WebComponent } from './Model/WebComponent';

import { AureliaHtmlParser } from './Parsers/AureliaHtmlParser';
import { Methods, Properties, ViewModelDocument } from './Model/ViewModelDocument';

import { normalizePath } from "../Util/NormalizePath";
import { AureliaSettingsNS } from '../AureliaSettings';

export default class ProcessFiles {

  public components: WebComponent[] = Array<WebComponent>();

  public async processPath(extensionSettings: AureliaSettingsNS.IExtensionSettings): Promise<void> {

    const sourceDirectory = sys.getCurrentDirectory();
    const paths = sys.readDirectory(sourceDirectory, ['ts', 'js', 'html'], ['node_modules', 'aurelia_project'], extensionSettings.pathToAureliaProject);

    for (let path of paths) {
      path = normalizePath(path);
      const name = Path.basename(path).replace(/\.(ts|js|html)$/, '').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
      try {
        if (name.endsWith('.spec')) continue;

        const component = this.findOrCreateWebComponentBy(name);

        if (!component.paths.includes(path)) {
          component.paths.push(path);
        }

        switch (Path.extname(path)) {
          case '.js':
          case '.ts': {
            const fileContent: string = sys.readFile(path, 'utf8');
            const result = processSourceFile(path, fileContent, 'typescript');
            component.viewModel = new ViewModelDocument();
            component.viewModel.type = "typescript";
            if (result?.result.length > 0) {
              const defaultExport = result.result.find(cl => cl.modifiers?.indexOf('default') > -1);
              if (typeof defaultExport !== 'undefined') {
                component.viewModel.properties = defaultExport.properties;
                component.viewModel.methods = defaultExport.methods;
              } else {
                component.viewModel.properties = result.result[0].properties;
                component.viewModel.methods = result.result[0].methods;
              }

              for (const classDef of result.result) {
                if (classDef === defaultExport) {
                  continue;
                }

                if (classDef.modifiers?.indexOf('export') > -1) {
                  component.classes.push({
                    name: classDef.name,
                    methods: classDef.methods
                  });
                }
              }
            }

            break;
          }
          case '.html': {
            // eslint-disable-next-line no-await-in-loop
            const htmlTemplate = await new AureliaHtmlParser().processFile(path);
            component.document = htmlTemplate;
            break;
          }
        }

        // replace it
        const idx = this.components.findIndex(c => c.name === component.name);
        if (idx === -1) {
          this.components.push(component);
        } else {
          this.components[idx] = component;
        }

      } catch (ex) {
        console.log(`failed to parse path ${path}`);
        console.log(JSON.stringify(ex.message));
        console.log(JSON.stringify(ex.stack));
      }
    }
  }

  private findOrCreateWebComponentBy(name) {
    let component = this.components.find(c => c.name === name);
    if (typeof component === 'undefined') {
      component = new WebComponent(name);
    }
    return component;
  }
}

export function processSourceFile(fileName: string, content: string, type: string) {
  const sourceFile = createSourceFile(
    fileName,
    content,
    ScriptTarget.Latest,
    true,
    type === "typescript" ? ScriptKind.TS : ScriptKind.JS);

  return {
    result: processFile(sourceFile),
    uri: fileName
  };
}

function processFile(sourceFile: SourceFile) {

  const getCodeInformation = (node: Node) => {
    const classes = [];
    forEachChild(node, n => {
      if (n.kind === SyntaxKind.ClassDeclaration) {
        classes.push(processClassDeclaration(n));
      }
    });
    return classes;
  };
  return getCodeInformation(sourceFile);
}

function processClassDeclaration(node: Node) {
  const properties: Properties = [];
  const methods: Methods = [];
  let lineNumber: number;
  let lineStart: number;
  let startPos: number;
  let endPos: number;
  if (typeof node === 'undefined') {
    return { properties, methods };
  }

  const declaration = (node as ClassDeclaration);
  const srcFile = node.getSourceFile();

  if (typeof declaration.members !== 'undefined') {
    for (const member of declaration.members) {
      switch (member.kind) {
        case SyntaxKind.PropertyDeclaration: {
          const property = member as PropertyDeclaration;
          let propertyModifiers;
          if (typeof property.modifiers !== 'undefined') {
            propertyModifiers = property.modifiers.map(i => i.getText());
            if (propertyModifiers.indexOf("private") > -1) {
              continue;
            }
          }
          const propertyName = property.name.getText();
          let propertyType;
          if (typeof property.type !== 'undefined') {
            propertyType = property.type.getText();
          }

          // getSourceFile
          lineNumber = srcFile.getLineAndCharacterOfPosition(property.name.end).line;
          lineStart = srcFile.getLineStarts()[lineNumber];
          startPos = property.name.pos - lineStart + 1;
          endPos = srcFile.getLineEndOfPosition(lineNumber);

          let isBindable = false;
          if (typeof member.decorators !== 'undefined') {
            isBindable = member.decorators[0].getText() === '@bindable';
          }

          properties.push({
            name: propertyName,
            modifiers: propertyModifiers,
            isBindable,
            type: propertyType,
            range: Range.create(
              Position.create(lineNumber, startPos),
              Position.create(lineNumber, endPos)
            )
          });
          break;
        }
        case SyntaxKind.GetAccessor:
          break;
        case SyntaxKind.MethodDeclaration: {
          const memberDeclaration = member as MethodDeclaration;
          let memberModifiers;
          if (typeof memberDeclaration.modifiers !== 'undefined') {
            memberModifiers = memberDeclaration.modifiers.map(i => i.getText());
            if (memberModifiers.indexOf("private") > -1) {
              continue;
            }
          }
          const memberName = memberDeclaration.name.getText();
          let memberReturnType;
          if (typeof memberDeclaration.type !== 'undefined') {
            memberReturnType = memberDeclaration.type.getText();
          }

          const params = [];
          if (typeof memberDeclaration.parameters !== 'undefined') {
            for (const param of memberDeclaration.parameters) {
              const p = param;
              params.push(p.name.getText());
            }
          }

          lineNumber = srcFile.getLineAndCharacterOfPosition(member.name.end).line;
          lineStart = srcFile.getLineStarts()[lineNumber];
          startPos = memberDeclaration.name.pos - lineStart + 1;
          endPos = srcFile.getLineEndOfPosition(lineNumber);

          methods.push({
            name: memberName,
            returnType: memberReturnType,
            modifiers: memberModifiers,
            parameters: params,
            range: Range.create(
              Position.create(lineNumber, startPos),
              Position.create(lineNumber, endPos),
            )
          });
          break;
        }
      }
    }
  }

  let classModifiers = [];
  if (typeof declaration.modifiers !== 'undefined') {
    classModifiers = declaration.modifiers.map(m => m.getText());
  }

  return {
    name: declaration.name.getText(),
    properties,
    methods,
    modifiers: classModifiers
  };
}
