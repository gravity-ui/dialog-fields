import type {StorybookConfig} from '@storybook/react-webpack5';
const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-docs',
        '@storybook/preset-scss',
        '@storybook/addon-webpack5-compiler-babel',
    ],

    framework: {
        name: '@storybook/react-webpack5',
        options: {fastRefresh: true},
    },

    docs: {
        defaultName: 'Docs',
    },
    typescript: {
        check: true,
        checkOptions: {},
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            setDisplayName: false,
            shouldExtractLiteralValuesFromEnum: true,
            compilerOptions: {
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
            },
        },
    },
    build: {
        test: {
            disableSourcemaps: false,
        },
    },
};
export default config;
