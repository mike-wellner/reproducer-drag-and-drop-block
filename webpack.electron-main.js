const path = require('path');

module.exports = {
  mode: 'development',
  entry: './electron-main.ts',
  target: 'node',
  node: {
    '__filename': true,
    '__dirname': true
  },
  externals: {
    'electron': 'require("electron")'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
        options: { configFile: 'tsconfig.electron-main.json' }
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'electron-main.js',
    path: path.resolve(__dirname)
  }
};
