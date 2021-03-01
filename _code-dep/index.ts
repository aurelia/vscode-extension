import * as server from '../server/src/server';
import * as client from '../client/src/extension';

// Command to run (from root dir) to get deps graph
// ./node_modules/.bin/code-dependency --exclude "node_modules" --source ./_code-dep
// or run
// `npm run start:depTree`
// `yarn start:depTree`