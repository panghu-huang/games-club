const path = require('path')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = {
  cleanConsoleOnRebuild: true,
  publicPath: '/public/',
  serverEntry: path.resolve(__dirname, './src/server.ts'),
  configureWebpack: (isServer, config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.ts'),
    }

    config.module.rules[0].options.plugins.push(
      require.resolve('@babel/plugin-proposal-optional-chaining')
    )
    if (isServer) {
      return config
    }

    config.module.rules[0].options.plugins.push(
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
          style: 'css',
        }
      ]
    )

    // 类似 { resolve.alias: { 'moment$': 'dayjs' } }
    config.plugins.push(
      new AntdDayjsWebpackPlugin()
    )

    return config
  }
}
