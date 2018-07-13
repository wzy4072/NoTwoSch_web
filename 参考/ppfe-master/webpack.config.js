var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const { WebPlugin, AutoWebPlugin } = require('web-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = [
    {
        entry: {
            root: './src/root.js',
            // app: './src/app.js',
            company: './src/company.js',
            admin: './src/admin.js',
            commonHeader: './static/commonHeader/commonHeader.js'
        },
        output: {
            path: resolve('dist/'),
            filename: 'js/[name].js',
        },
        plugins: [
            new WebPlugin({
                filename: 'index.html',
                // html template file path（full path relative to webpack.config.js）
                template: './html/root.html',
                requires: ['vendor', 'root'],
            }),
            // new WebPlugin({
            //     filename: 'app/index.html',
            //     // html template file path（full path relative to webpack.config.js）
            //     template: './html/app.html',
            //     requires: ['vendor', 'app', 'commonHeader'],
            // }),
            new WebPlugin({
                filename: 'company/index.html',
                // html template file path（full path relative to webpack.config.js）
                template: './html/company.html',
                requires: ['vendor', 'company', 'commonHeader'],
            }),
            new WebPlugin({
                filename: 'clogin.html',
                // html template file path（full path relative to webpack.config.js）
                template: './html/clogin.html',
                requires: [],
            }),
            new WebPlugin({
                filename: 'admin/index.html',
                // html template file path（full path relative to webpack.config.js）
                template: './html/admin.html',
                requires: ['vendor', 'admin'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['root', 'company', 'admin'],
                filename: 'js/vendor-[hash].min.js',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    include: [resolve('src')],
                    options: {
                        loaders: {
                        },
                        // other vue-loader options go here
                    }
                },
                {
                    test: /\.js$/,
                    include: [resolve('src')],
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                },
                {
                    test: /\.css$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }]
                },
                {
                    test: /\.less$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader" // compiles Less to CSS
                    }]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'appconfig': path.join(__dirname, 'config', process.env.NODE_ENV),
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        },
        devServer: {
            historyApiFallback: true,
            noInfo: true,
            host: '0.0.0.0',
            disableHostCheck: true,
        },
        performance: {
            hints: false
        },
        devtool: '#source-map'
    },
    {
        entry: {
            commonHeader: './static/commonHeader/commonHeader.js'
        },
        output: {
            path: resolve('dist/'),
            filename: 'js/commonHeader/[name].js',
            library: 'commonHeader',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'appconfig': path.join(__dirname, 'config', process.env.NODE_ENV),
            }
        },
        plugins: [
            // copy custom static assets
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './static'),
                    to: 'static',
                    ignore: ['.*', 'favicon.ico']
                },
                {
                    from: path.resolve(__dirname, './static/favicon.ico')
                }
            ]),
            // new CopyWebpackPlugin([
            //     {
            //         from: path.resolve(__dirname, './static'),
            //         to: 'static',
            //         ignore: ['.*']
            //     }
            // ]),
        ]

    }
]

if (process.env.NODE_ENV === 'production') {
    module.exports[0].module = {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [resolve('src')],
                options: {
                    loaders: {
                    },
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                include: [resolve('src')],
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader'
            }
        ]
    },
        module.exports[0].devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports[0].plugins = (module.exports[0].plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
