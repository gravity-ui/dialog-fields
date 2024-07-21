import type {StorybookConfig} from '@storybook/react-webpack5';
const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        {name: '@storybook/addon-essentials', options: {backgrounds: false}},
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
        '@storybook/addon-webpack5-compiler-babel'
    ],

    framework: {
        name: '@storybook/react-webpack5',
        options: {fastRefresh: true},
    },

    docs: {
        defaultName: 'Docs'
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    }
};
export default config;
