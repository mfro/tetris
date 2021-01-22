const path = require('path');

module.exports = {
  publicPath: '',

  outputDir: 'dist',

  pages: {
    index: {
      title: 'tetris',
      entry: 'src/main.ts',
      filename: 'index.html',
      template: 'src/main.html',
    },
  },

  devServer: {
    disableHostCheck: true,
  },

  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue$: path.resolve('../../chess/vue-next/packages/vue/dist/vue.runtime.esm-bundler.js'),
      }
    },
  },
};
