import * as fs from 'fs';
import * as path from 'path';

import { PROJECT_CONFIG } from '../../project.config';
import { ObjectUtils } from '../object/ObjectUtils';
import { StringUtils } from '../string/StringUtils';
import { UriUtils } from '../view/uri-utils';
import { generateDependencyTreeSingle } from './errorStackLogging';

__dirname; /* ? */
const errorStacks = [
  `at logFoundAureliaProjects (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:313:33)
    at AureliaProjects.<anonymous> (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:111:33)
    at Generator.next (<anonymous>)
    at fulfilled (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:62:52)
  `,
  // region other logs

  // ` at (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:316:37
  //   at Array.forEach (<anonymous>)
  //   at logFoundAureliaProjects (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:314:42)
  //   at AureliaProjects.<anonymous> (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:111:33)
  // `,
  // ` at AureliaProjects.<anonymous> (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:143:40)
  //   at Generator.next (<anonymous>)
  //   at (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:79:135
  //   at new Promise (<anonymous>)
  // `,
  // ` at DiagnosticMessages.log (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/common/diagnosticMessages/DiagnosticMessages.js:20:37)
  //   at (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/regions/ViewRegions.js:577:42
  //   at Array.forEach (<anonymous>)
  //   at Function.parse5Start (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/regions/ViewRegions.js:572:58)
  // `,
  // ` at DiagnosticMessages.additionalLog (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/common/diagnosticMessages/DiagnosticMessages.js:24:37)
  //   at (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/regions/ViewRegions.js:578:42
  //   at Array.forEach (<anonymous>)
  //   at Function.parse5Start (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/regions/ViewRegions.js:572:58)
  // `,
  // ` at logComponentList (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/viewModel/AureliaComponents.js:264:34)
  //   at AureliaComponents.init (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/viewModel/AureliaComponents.js:109:30)
  //   at AureliaProgram.initAureliaComponents (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/viewModel/AureliaProgram.js:23:53)
  //   at AureliaProjects.<anonymous> (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:230:57)
  // `,
  // ` at AureliaProjects.<anonymous> (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:151:41)
  //   at Generator.next (<anonymous>)
  //   at fulfilled (/home/hdn/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/server/src/core/AureliaProjects.js:62:52)
  //   at processTicksAndRejections (node:internal/process/task_queues:96:5)
  // `,
];

// endregion other logs
const wish = `
  | File name       | linenumber | Call site
  | AureliaProjects | 111        | AureliaProjects.<anonymous>
  | AureliaProjects | 313        |     logFoundAureliaProjects

  | AureliaProjects | 111        | AureliaProjects.<anonymous>
  | AureliaProjects | 314        |     logFoundAureliaProjects

  | initialization  | 49         | -
  | AureliaProjects | 141        |     AureliaProjects.hydrate
  | AureliaProjects | 143        |         AureliaProjects.<anonymous>
  |                 |            |             Array.forEach

  | RegionParser    | 82         | -
  | ViewRegions     | 572        |     Function.parse5Start
  | DiagnosticMesss | 20         |         DiagnosticMessages.log

  | RegionParser    | 82         | -
  | ViewRegions     | 572        |     Function.parse5Start
  | DiagnosticMesss | 24         |         DiagnosticMessages.additionalLog

  | AureliaProjects | 230        | AureliaProjects.<anonymous>
  | AureliaProgram  | 23         |     AureliaProgram.initAureliaComponents
  | AureliaComponen | 109        |         AureliaComponents.init
  | AureliaComponen | 264        |             logComponentList

  | AureliaProjects | 151        | AureliaProjects.<anonymous>
`;

const errorStackTracker = {};
const TRACKER_SEPARATOR = ':';
const DONT_TRACK = [
  'node:internal/process',
  '(<anonymous>)',
  'Promise',
  'fulfilled',
];
function shouldNotTrack(source: string) {
  const shouldNot = DONT_TRACK.find((donts) => source.includes(donts));
  return shouldNot;
}

export function prettifyCallstack(rawErrorSplit: string[]): {
  pickedStack: {};
  rawToTrackerList: (string | undefined)[];
} {
  const errorSplit = rawErrorSplit.reverse();
  // errorSplit; /*?*/
  // TODO findIndex of Logger.log (stack always starts with 4 elements we are not interested in (Error\nfindLog\nLogmsseag...))

  // - 1. Turn into tracker list
  const rawToTrackerList = turnIntoRawTrackerList(errorSplit);
  rawToTrackerList.forEach((rawTrackerEntry) => {
    if (rawTrackerEntry == null) return;
    const [fileName, lineNumber, caller] =
      rawTrackerEntry.split(TRACKER_SEPARATOR);
    const nameLineTracker = `${fileName}${TRACKER_SEPARATOR}${lineNumber}`;
  });

  const result = generateDependencyTreeSingle(
    errorStackTracker,
    rawToTrackerList
  );

  // - 2. Only get actual stack
  const pickedStack = {};
  ObjectUtils.atPath(result, rawToTrackerList, pickedStack);
  // rawToTrackerList.forEach((trackerLine) => {
  //   if (trackerLine == null) return;
  //   // @ts-ignore
  //   actualStack[trackerLine] = result[trackerLine];
  //   trackerLine;
  // });

  // - 3. Put into actual tracker
  // ^ TODO

  // ...
  return { pickedStack, rawToTrackerList };
}

/**
 * @example
 * new Error().stack
 * -->
 * [
 *   'AureliaProjects.js:62:fulfilled',
 *   'AureliaProjects.js:111:AureliaProjects.<anonymous>',
 *   'AureliaProjects.js:313:logFoundAureliaProjects'
 * ]
 */
function turnIntoRawTrackerList(errorSplit: string[]) {
  return errorSplit
    .map((errorLine) => {
      // errorLine.trim(); /*?*/
      const splitLine = errorLine.trim().split(' ');
      const cleanedLine = splitLine.filter((line) => line);
      if (cleanedLine.length === 0) return;
      const [_at, _caller, ..._paths] = cleanedLine;

      let targetPath = _paths[0];
      if (_paths.length >= 2) {
        targetPath = _paths.join(' ');
      }

      try {
        if (shouldNotTrack(targetPath)) return;
        if (shouldNotTrack(_caller)) return;
        const remapped = remapWallabyToNormalProject(targetPath);
        if (typeof remapped === 'string') return;
        const jsPath = getJsPathMatch(targetPath)?.groups?.PATH;
        // const jsLine = getJsPathMatch(_path)?.groups?.LINE;
        const jsFileName = path.basename(jsPath ?? '').replace(/.js$/, '.ts');
        const trackerKey = `${jsFileName}${TRACKER_SEPARATOR}${remapped.remappedLine}${TRACKER_SEPARATOR}${_caller}`;
        return trackerKey;
      } catch (_error) {}
    })
    .filter((line) => line);
}

export function remapWallabyToNormalProject(targetPath: string) {
  // - 1. Find in .js file
  // Before: (path/to/file.js:151:41)
  // Match: path/to/file.js
  const jsPathMatch = getJsPathMatch(targetPath);
  if (jsPathMatch == null) return '`findLogSource` File not found';
  if (jsPathMatch.groups == null) return '`findLogSource` No Group';
  const jsPath = jsPathMatch.groups.PATH;
  const targetJsLine = Number(jsPathMatch.groups.LINE) - 1;
  const jsFile = fs.readFileSync(jsPath, 'utf-8');
  const jsLine = jsFile.split('\n')[targetJsLine];
  // Before: $_$w(39, 106, $_$c), original.code('');
  // Match: original.code('');
  const jsCodeRegex = /(?:\$_\$w\(.*\), )(?<ORIGINAL>.*)/;
  const jsCodeMatch = jsCodeRegex.exec(jsLine);
  if (jsCodeMatch == null) return '`findLogSource` No line';
  if (jsCodeMatch.groups == null) return '`findLogSource` No original group';
  const originalCode = jsCodeMatch.groups.ORIGINAL;

  // - 2. Find in .ts file
  const tsPath = jsPath.replace('.js', '.ts');
  const tsFile = fs.readFileSync(tsPath, 'utf-8');
  const targetTsLines = tsFile
    .split('\n')
    .map((line, index) => {
      const normalizedLine = StringUtils.replaceAll(line, ' ', '');
      const normalizedOriginalCode = StringUtils.replaceAll(
        originalCode,
        ' ',
        ''
      );
      if (!normalizedLine.includes(normalizedOriginalCode)) return;
      return [index + 1, line]; // + 1 Lines are shown 1-indexed
    })
    .filter((line) => line != null);

  // - 3. Map back instrumented to project
  // Before: ~/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/your/code
  // Match: ~/.vscode/extensions/wallabyjs.wallaby-vscode-1.0.317/projects/832463c82f802eb4/instrumented/
  const wallabyPathRegex = /(.*wallabyjs.wallaby.*instrumented)/;
  const wallabyPathMatch = wallabyPathRegex.exec(tsPath);
  if (wallabyPathMatch == null) return 'wallaby not found';
  const wallabyPath = wallabyPathMatch[1];
  const finalTsPath = tsPath.replace(wallabyPath, PROJECT_CONFIG.projectPath);
  const finalLinesNumberText = targetTsLines
    .map(([lineNumber, _code] = []) => lineNumber)
    .join(', ');
  const finalSourceName = `Loc: file://${finalTsPath} ${finalLinesNumberText}`;
  // const finalSourceName = finalLinesText;

  return {
    remappdeLocation: finalSourceName,
    remappedLine: finalLinesNumberText,
  };
}

function getJsPathMatch(targetPath: string) {
  targetPath = UriUtils.toSysPath(targetPath);
  const jsPathRegexp = /(?:\(?)(?<PATH>.*)\:(?<LINE>\d+)\:\d+(?:\)?)$/;
  const jsPathMatch = jsPathRegexp.exec(targetPath);
  return jsPathMatch;
}
