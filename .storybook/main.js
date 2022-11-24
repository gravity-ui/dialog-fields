const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-scss"
  ],
  typescript: {
    check: true,
  },
  babel: async (options) => ({
    ...options,
    'plugins': [
      '@babel/plugin-proposal-class-properties',
      ["@babel/plugin-proposal-private-methods", { "loose": false }],
      ["@babel/plugin-proposal-private-property-in-object", { "loose": false }],
    ]
  }),

  webpackFinal: async (storybookBaseConfig) => {
    const {plugins} = storybookBaseConfig;
    const {rules} = storybookBaseConfig.module;
    const fileLoader = rules.find(({loader}) => loader && loader.indexOf('/file-loader/') !== -1);
    if (fileLoader) {
      const {test} = fileLoader;
      let reStr = test.toString();
      reStr = reStr.substr(1, reStr.length - 2);
      let tmp = reStr.replace('svg|', '');
      tmp = tmp.replace('|svg', '');
      if (reStr === tmp) {
        console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('!!! It looks like file-loader was not configured to handle svg-files. !!!');
        console.log('!!! It is better to recheck that all works fine.                      !!!');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
      } else {
        const newRe = new RegExp(tmp);
        fileLoader.test = newRe;
        console.log('\nsvg-files are excluded from test-expression of "file-loader":');
        console.log('  old test:', test.toString());
        console.log('  new test:', newRe.toString(), '\n');
      }
      rules.splice(0, 0, {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'sprite-[hash:6].svg',
        },
      })
      plugins.splice(0, 0, new SpriteLoaderPlugin({plainSprite: true}));
    } else {
      throw new Error('Unexpected behavior: file-loader is not found, something might be wrong (or not)');
    }
    return storybookBaseConfig;
  },
}
