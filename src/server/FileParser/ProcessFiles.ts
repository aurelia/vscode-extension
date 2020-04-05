import { Range, Position, createConnection, IConnection } from 'vscode-languageserver';
import * as Path from 'path';
import {
  Node, SourceFile, createSourceFile, ScriptTarget, ScriptKind,
  forEachChild, ClassDeclaration, sys
} from "typescript";
import * as ts from "typescript";

import { WebComponent } from './Model/WebComponent';

import { AureliaHtmlParser } from './Parsers/AureliaHtmlParser';
import { Methods, Properties, ViewModelDocument } from './Model/ViewModelDocument';

import { normalizePath } from "../Util/NormalizePath";
import { AureliaSettingsNS } from '../AureliaSettings';

const connection: IConnection = createConnection();
const logger = connection.console;

interface IProcessedClassDeclaration {
  properties: Properties;
  methods: Methods;
  name?: string;
  modifiers?: string[];
}

export default class ProcessFiles {

  public components: WebComponent[] = [];

  public async processPath(extensionSettings: AureliaSettingsNS.IExtensionSettings): Promise<void> {

    const sourceDirectory = sys.getCurrentDirectory();
    const paths = sys.readDirectory(sourceDirectory, ['ts', 'js', 'html'], ['node_modules', 'aurelia_project'], extensionSettings.pathToAureliaProject);
    const aureliaParser = new AureliaHtmlParser();

    for (let path of paths) {
      path = normalizePath(path);
      const name = Path.basename(path).replace(/\.(ts|js|html)$/, '').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
      try {
        if (name.endsWith('.spec')) continue;

        const component = this.findOrCreateWebComponentByName(name);

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
              const defaultExport = result.result.find(cl => cl.modifiers?.includes('default'));
              if (defaultExport !== undefined) {
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

                if (classDef.modifiers?.includes('export')) {
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
            try {
              // eslint-disable-next-line require-atomic-updates, no-await-in-loop
              component.document = await aureliaParser.processFile(path);
            } catch (err) {
              logger.log(`Error when parsing html template for path '${path}'. Component still added to web component list.`);
              const reason = err.message !== undefined ? err.message as string : "Unknown";
              logger.log(`Reason: ${reason}`);
            }
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
        logger.log(`failed to parse path ${path}`);
        logger.log(JSON.stringify(ex.message));
        logger.log(JSON.stringify(ex.stack));
      }
    }
  }

  private findOrCreateWebComponentByName(name: string) {
    let component = this.components.find(c => c.name === name);
    if (component === undefined) {
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

function processFile(sourceFile: SourceFile): IProcessedClassDeclaration[] {
  const getCodeInformation = (node: Node) => {
    const classes: IProcessedClassDeclaration[] = [];
    forEachChild(node, n => {
      if (ts.isClassDeclaration(n)) {
        classes.push(processClassDeclaration(n));
      }
    });
    return classes;
  };
  return getCodeInformation(sourceFile);
}

function processClassDeclaration(classDeclaration: ClassDeclaration): IProcessedClassDeclaration {
  const properties: Properties = [];
  const methods: Methods = [];
  let lineNumber: number;
  let lineStart: number;
  let startPos: number;
  let endPos: number;
  if (classDeclaration === undefined) {
    return { properties, methods };
  }

  // const declaration = (node as ClassDeclaration);
  const srcFile = classDeclaration.getSourceFile();

  if (classDeclaration.members !== undefined) {
    for (const member of classDeclaration.members) {
      // Property handling
      if (ts.isPropertyDeclaration(member)) {
        let propertyModifiers;
        if (member.modifiers !== undefined) {
          propertyModifiers = member.modifiers.map(i => i.getText());
          if (propertyModifiers.indexOf("private") > -1) {
            continue;
          }
        }
        const propertyName = member.name.getText();
        let propertyType;
        if (member.type !== undefined) {
          propertyType = member.type.getText();
        }

        lineNumber = srcFile.getLineAndCharacterOfPosition(member.name.end).line;
        lineStart = srcFile.getLineStarts()[lineNumber];
        startPos = member.name.pos - lineStart + 1;
        endPos = srcFile.getLineEndOfPosition(lineNumber);

        let isBindable = false;
        if (member.decorators !== undefined) {
          isBindable = member.decorators[0].getText().includes('@bindable');
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
      }

      // Method handling
      if (ts.isMethodDeclaration(member)) {
        // Extract modifiers
        let memberModifiers: string[] = [];
        if (member.modifiers !== undefined) {
          memberModifiers = member.modifiers.map(i => i.getText());
          // If the method has a private modifier we skip the handling of the method
          if (memberModifiers.includes("private")) {
            continue;
          }
        }

        const memberName = member.name.getText();
        let memberReturnType;
        if (member.type !== undefined) {
          memberReturnType = member.type.getText();
        }

        const params = [];
        if (member.parameters !== undefined) {
          for (const param of member.parameters) {
            const p = param;
            params.push(p.name.getText());
          }
        }

        lineNumber = srcFile.getLineAndCharacterOfPosition(member.name.end).line;
        lineStart = srcFile.getLineStarts()[lineNumber];
        startPos = member.name.pos - lineStart + 1;
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
      }
    }
  }

  let classModifiers = [];
  if (classDeclaration.modifiers !== undefined) {
    classModifiers = classDeclaration.modifiers.map(m => m.getText());
  }

  return {
    name: classDeclaration.name.getText(),
    properties,
    methods,
    modifiers: classModifiers
  };
}
