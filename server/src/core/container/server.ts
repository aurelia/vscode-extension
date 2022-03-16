import 'reflect-metadata';

import { Container } from 'aurelia-dependency-injection';
import { AureliaProjects } from './AureliaProjects';
import { AureliaServer } from './AureliaServer';
import { ExtensionSettings } from './DocumentSettings';

function server() {
  const container = new Container();
  const serverSetting: ExtensionSettings = { flag: 'WOORK PLEASE' };

  const aureliaServer = new AureliaServer(container, serverSetting);
  container.getResolver(AureliaProjects); /*?*/

}

server();
