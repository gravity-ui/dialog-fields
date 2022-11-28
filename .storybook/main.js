module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/preset-scss',
        'storybook-preset-inline-svg',
    ],
    typescript: {
        check: true,
    },
    framework: '@storybook/react',
    features: {
        postcss: false,
    },
};
