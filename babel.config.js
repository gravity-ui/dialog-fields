// eslint-disable-next-line no-undef
module.exports = function (api) {
    api.cache(true);

    // eslint-disable-next-line no-undef
    if (process.env.DF_BUILD_LIB) {
        // app-builder has its own configuration for babel
        return {};
    }

    return {
        sourceType: 'unambiguous',
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        chrome: 100,
                    },
                },
            ],
            '@babel/preset-typescript',
            '@babel/preset-react',
        ],
        plugins: [],
    };
};
