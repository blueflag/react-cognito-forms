var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/index',
    output: {
        path: 'lib',
        filename: 'index.js',
        libraryTarget: "commonjs2"
    },
    // target: 'node',
    externals: {
        "process.env": "var process.env",
        "react": "react"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
