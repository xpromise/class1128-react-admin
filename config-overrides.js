/**
 * antd用来修改webpack配置的文件
 */
const { resolve } = require('path');
const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy, addWebpackAlias } = require('customize-cra');

module.exports = override(
  // 按需加载
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  // 自定义主题
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
  // 编译装饰器语法
  /*addBabelPlugins(
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  )*/
  addDecoratorsLegacy(),
  // 配置路径的别名 - 注意以特殊符号开头，防止与正常路径冲突
  addWebpackAlias({
    $utils: resolve(__dirname, 'src/utils'),
    $api: resolve(__dirname, 'src/api'),
    $assets: resolve(__dirname, 'src/assets'),
    $comp: resolve(__dirname, 'src/components'),
  })
);