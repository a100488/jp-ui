const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@/', resolve('src'))
    // config.plugins.delete('prefetch')
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/userfiles': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/userfiles': '/userfiles'
        }
      }
    }
  },

  lintOnSave: undefined
}