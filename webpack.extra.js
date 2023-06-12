/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  target: 'electron-renderer',
  cache: false,
  node: {
    global: true,
    __filename: true,
    __dirname: true
  },
  externals: {
    electron: 'window.require("electron")'
  }
}
