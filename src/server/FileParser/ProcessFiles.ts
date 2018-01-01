import * as Path from 'path';
import * as FileSystem from 'fs';
import { Parser, AccessScope }  from 'aurelia-binding';
import { Node, SyntaxKind, SourceFile, createSourceFile, ScriptTarget, ScriptKind, 
  forEachChild, ClassDeclaration, PropertyDeclaration, MethodDeclaration, ParameterDeclaration, sys} from "typescript";
import {HtmlTemplateDocument} from './Model/HtmlTemplateDocument';

import {WebComponent} from './Model/WebComponent';

import { AureliaHtmlParser } from './Parsers/AureliaHtmlParser';
import { ViewModelDocument } from './Model/ViewModelDocument';

import { HTMLDocumentParser, TagDefinition, AttributeDefinition } from './HTMLDocumentParser';
import { normalizePath } from './../Util/NormalizePath';


export default class ProcessFiles {

  public components = new Array<WebComponent>();

  public async processPath(): Promise<void> {

    const sourceDirectory = Path.join(sys.getCurrentDirectory(), '/src/');
    const paths = sys.readDirectory(sourceDirectory, ['ts', 'js', 'html']);

    for (let path of paths) {
      path = normalizePath(path);
      try {

        const name = Path.basename(path).replace(/\.(ts|js|html)$/, '').split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
        const component = this.findOrCreateWebComponentBy(name);

        if (component.paths.indexOf(path) === -1) {
          component.paths.push(path);
        }

        switch(Path.extname(path)) {
          case '.ts':
            const fileContent:string = sys.readFile(path, 'utf8');
            const result = processSourceFile(path, fileContent, 'typescript');
            component.viewModel = new ViewModelDocument();
            component.viewModel.type = "typescript";
            if (result && result.result.length) {
              var defaultExport = result.result.find(cl => cl.modifiers && cl.modifiers.indexOf('default') > -1);
              if (defaultExport) {
                component.viewModel.properties = defaultExport.properties;
                component.viewModel.methods = defaultExport.methods;
              } else {
                component.viewModel.properties = result.result[0].properties;
                component.viewModel.methods = result.result[0].methods;
              }

              for(const classDef of result.result) {
                if (classDef === defaultExport) {
                  continue;
                }

                if (classDef.modifiers && classDef.modifiers.indexOf('export') > -1) {
                  component.classes.push({
                    name: classDef.name,
                    methods: classDef.methods
                  });
                }
              }
            }

            break;
          case '.js':
            //console.log('proces js', path);
            break;
          case '.html':
            const htmlTemplate = await new AureliaHtmlParser().processFile(path);
            component.document = htmlTemplate;
            break;
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
        console.log(JSON.stringify(ex));
      }
    }
  }

  private findOrCreateWebComponentBy(name) {
    let component = this.components.find(c => c.name === name);
    if (!component) {
      component = new WebComponent(name);
    }
    return component;
  }
}


export function processSourceFile(fileName: string, content: string, type: string) {
  let sourceFile = createSourceFile(
        fileName, 
        content, 
        ScriptTarget.Latest,
        true,
        type === "typescript" ? ScriptKind.TS : ScriptKind.JS);
  
  return {
    result: processFile(sourceFile),
    uri: fileName
  }
}

function processFile(sourceFile: SourceFile) {
 
  let getCodeInformation = (node : Node) => {  
    let classes = [];
    forEachChild(node, n => {
      if (n.kind === SyntaxKind.ClassDeclaration) {
        classes.push(processClassDeclaration(n));
      }
    });
    return classes;
  }
  return getCodeInformation(sourceFile);
}

function processClassDeclaration(node: Node) {
    let properties = [];
    let methods = [];
    if (!node) {
      return {properties, methods};
    }

    let declaration = (node as ClassDeclaration);
    if (declaration.members) {
      for (let member of declaration.members) {
        switch(member.kind) {
          case SyntaxKind.PropertyDeclaration:
            let property = member as PropertyDeclaration;
            const propertyModifiers = property.modifiers.map(i => i.getText());
            if (propertyModifiers.indexOf("private") > -1) {
              continue;
            }
            const propertyName = property.name.getText();
            let propertyType = undefined;
            if (property.type) {
              propertyType = property.type.getText();
            }
            properties.push({
              name: propertyName,
              modifiers: propertyModifiers,
              type: propertyType
            });
          break;
          case SyntaxKind.GetAccessor:
          break;
          case SyntaxKind.MethodDeclaration:
            let memberDeclaration = member as MethodDeclaration;
            const memberModifiers = memberDeclaration.modifiers.map(i => i.getText());
            if (memberModifiers.indexOf("private") > -1) {
              continue;
            }            
            let memberName = memberDeclaration.name.getText();
            let memberReturnType = undefined;
            if (memberDeclaration.type) {
              memberReturnType = memberDeclaration.type.getText();
            }

            let params = [];
            if (memberDeclaration.parameters) {
              for(let param of memberDeclaration.parameters) {
                const p = param as ParameterDeclaration;
                params.push(p.name.getText());
              }
            }
            
            methods.push({
              name: memberName,
              returnType: memberReturnType,
              modifiers: memberModifiers,
              parameters: params

            });
          break;
        }
      }
    }

    let classModifiers = [];
    if (declaration.modifiers) {
      classModifiers = declaration.modifiers.map(m => m.getText());
    }

    return {
      name: declaration.name.getText(),
      properties, 
      methods,
      modifiers: classModifiers
    };
}
