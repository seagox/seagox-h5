const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    // publicPath:'/oa-h5/',
    productionSourceMap: false,
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 9000,
        https: false,
        hotOnly: true,
        proxy: {
            '/api': {
                target: 'http://192.168.0.246',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css/, //匹配文件名
                        threshold: 10240, //对超过10k的数据进行压缩
                        deleteOriginalAssets: false //是否删除原文件
                    })
                ]
            }
        }
    }
}
