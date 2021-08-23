/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: '@jsdevtools/coverage-istanbul-loader',
              },
              {
                loader: 'ts-loader',
                options: { transpileOnly: true },
              },
            ],
          },
          {
            test: /\.feature$/,
            use: [
              {
                loader: '@badeball/cypress-cucumber-preprocessor/lib/loader',
              },
            ],
          },
        ],
      },
    },
  };

  on('file:preprocessor', wp(options));

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
