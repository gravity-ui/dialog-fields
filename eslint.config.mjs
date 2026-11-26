import baseConfig from '@gravity-ui/eslint-config';
import clientConfig from '@gravity-ui/eslint-config/client';
import prettierConfig from '@gravity-ui/eslint-config/prettier';

export default [
    ...baseConfig,
    ...clientConfig,
    ...prettierConfig,
    {
        rules: {
            'no-implicit-globals': 'off',
        },
    },
];
