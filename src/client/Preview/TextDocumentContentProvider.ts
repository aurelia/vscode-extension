	import * as vscode from 'vscode';
  import { LanguageClient } from 'vscode-languageclient';
  import { WebComponent } from './../../server/FileParser/Model/WebComponent';

  export class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    constructor(private client: LanguageClient) {
      
    }

		private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

		public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
      let editor = vscode.window.activeTextEditor;
      if (!vscode.window.activeTextEditor.document) {
        return Promise.resolve('<p>no data</p>');
      }
      let fileName = vscode.window.activeTextEditor.document.fileName;
      let component = <WebComponent> await this.client.sendRequest('aurelia-view-information', fileName);

      let headerHTML = `<h1>Component: '${component.name}'</h1>`;
      headerHTML += '<h2>Files</h2><ul>';
      for (let path of component.paths) {
        headerHTML += `<li>${path}</li>`;
      }
      headerHTML += '</ul>';

      let viewModelHTML = `<h2>no viewmodel found</h2>`;
      if (component.viewModel) {
        viewModelHTML = `<h2>ViewModel</h2>`;
        viewModelHTML += `<p>type: ${component.viewModel.type}</p>`;
        viewModelHTML += `<h3>Properties</h3>`;
        viewModelHTML += '<ul>';
        for (let prop of component.viewModel.properties) {
          viewModelHTML += `<li>${prop.name} (${prop.type})</li>`;
        }
        viewModelHTML += '</ul>';
        viewModelHTML += `<h3>Methods</h3>`;
        viewModelHTML += '<ul>';
        for (let prop of component.viewModel.methods) {
          viewModelHTML += `<li>${prop.name} (${prop.returnType}) => (params: ${prop.parameters.join(',')})</li>`;
        }
        viewModelHTML += '</ul>';        
      }

      let viewHTML = `<h2>No view found</h2>`;
      if (component.document) {
        viewHTML = `<h2>View</h2>`;


        if (component.document.references && component.document.references.length) {
          viewHTML += '<h3>Require/ references in template</h3>';
          viewHTML += `<ul>`;
          for(let reference of component.document.references) {
            viewHTML += `<li>path: ${reference.path}</li>`;
            viewHTML += `<li>as: ${reference.as}</li>`;
          }
          viewHTML += '</ul>';
        }

        if (component.document.bindables && component.document.bindables.length) {
          viewHTML += '<h3>bindable property on template</h3><ul>';
          for (let bindable of component.document.bindables) {
            viewHTML += `<li>${bindable}</li>`;
          }
          viewHTML += '</ul>';
        }

        if (component.document.dynamicBindables && component.document.dynamicBindables.length) {
          viewHTML += '<h3>Attributes with bindings found in template</h3>';
          for(let bindable of component.document.dynamicBindables) {
            viewHTML += `
              <ul>
                <li>attribute name : <code>${bindable.name}</code></li>
                <li>attribute value : <code>${bindable.value}</code></li>
                <li>binding type: <code>${bindable.bindingType}</code></li>
              </ul>`;
              viewHTML += `<pre><code>${JSON.stringify(bindable.bindingData, null, 2) }</code></pre>`;
          }
        }

        if (component.document.interpolationBindings && component.document.interpolationBindings.length) {
          viewHTML += '<h2>String interpolation found in template</h2>';
          for(let bindable of component.document.interpolationBindings) {
            viewHTML += `
              <code>${bindable.value}</code>`;
            viewHTML += `<pre><code>${JSON.stringify(bindable.bindingData, null, 2) }</code></pre>`;
          }
        }
      }

      let classesHTML = '<h2>no extra classes found</h2>';
      if (component.classes) {
         classesHTML = '<h2>exports to this view</h2>';
         for(let cl of component.classes) {
          classesHTML += `<li>${cl.name}</li>`;
         }
         classesHTML += '</ul>';
         
      }

      return `<body><style>pre { border: 1px solid #333; display: block; background: #1a1a1a; margin: 1rem;color: #999; }</style>
        ${headerHTML}
        <hr>
        ${viewModelHTML}
        <hr>
        ${viewHTML}
        <hr>
        ${classesHTML}
        <br><br>
      </body>`;
		}

		get onDidChange(): vscode.Event<vscode.Uri> {
			return this._onDidChange.event;
		}

		public update(uri: vscode.Uri) {
			this._onDidChange.fire(uri);
		}
	}
