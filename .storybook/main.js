const DisableWarnings = require('./disable-warnings.js');

module.exports = {
  stories: ['../projects/ui-framework/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-notes',
    `@storybook/addon-knobs`,
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.devServer = { stats: 'errors-only' };
    config.plugins.push(new DisableWarnings());

    // Return the altered config
    return config;
  },
};
