import type { StorybookConfig } from '@storybook/angular';

// Commented out because vite currently doesn't load the styles.
// import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../../../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials', 
    '@storybook/addon-interactions',    
  ],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  // Don't remove it, we need it from time to 
  // time for debug purposes
  webpackFinal: async (config) => {
    return {
      ...config,
    };
  },

  // TODO: Figure out why vite doesn't load the styles.
  /*core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      css: {
        preprocessorOptions: {
          // For example, if you are using SCSS
          scss: {
            additionalData: `
              @import "styles.scss"
            `
          }
        }
      }
    });
  },*/
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
