'use strict'
// 
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.
//配置本地node服务端读取JSON文件
var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res) {
    var url_info = require('url').parse(req.url, true);
    var file = "./json/pc" + url_info.pathname + ".json";
    fs.exists(file, (exists) => {
        var result = {"code": 0,"desc": url_info.pathname + ".json文件不存在"};
        if (exists) {
            result = JSON.parse(fs.readFileSync(file));
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
        }else{
            res.writeHead(400, {
                'Content-Type': 'application/json; charset=utf-8'
            });
        }
        res.end(JSON.stringify(result));
        res.end(result.join);
    });
});
server.listen(8888, '127.0.0.1');

const path = require('path')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://127.0.0.1:8888',
        target: 'http://kindergarten.instai.cn:8004',
        changeOrigin: true,
        pathRewrite: {"^/api" : ""}
        }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
