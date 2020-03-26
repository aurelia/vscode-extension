import * as Path from 'path';
import { Uri } from 'vscode';
export function fileUriToPath (uri: Uri) {

  const rest = decodeURI(uri.path.substring(7));
  const firstSlash = rest.indexOf('/');
  let host = rest.substring(0, firstSlash);
  let path = rest.substring(firstSlash + 1);

  if ('localhost' == host) host = '';

  if (host) {
    host = Path.sep + Path.sep + host;
  }
  path = path.replace(/^(.+)\|/, '$1:');
  if (Path.sep == '\\') {
    path = path.replace(/\//g, '\\');
  }
  path = path.replace('%3A', ':');
  return host + path;
}
