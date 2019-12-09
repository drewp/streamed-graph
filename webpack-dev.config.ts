const path = require("path");
const webpack = require('webpack');

const resolveConfig = {
    alias: {
        'webpack-plugin-serve/client': './node_modules/webpack-plugin-serve/client.js',
    },
    extensions: ['.ts', '.js', '.json']
};

const moduleConfig = {
    rules: [
        {
            test: /\.ts$/,
            loader: 'ts-loader',
        },
        {
            test: /\.css$/i,
            use: ['file-loader']
        },
        {
            test: /zzzzz\.js$/, use: {
                loader: 'babel-loader',
                options: {
                }
            }
        }
    ]
};
const pluginsConfig = [
];
module.exports = {
    name: "dev",
    mode: "development",
    entry: [
        './src/streamed-graph.ts',
        // './src/streamed-graph.css'   // doesn't emit anything
    ],
    output: {
        filename: 'streamed-graph.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: resolveConfig,
    devtool: 'source-map',
    module: moduleConfig,
    plugins: pluginsConfig,
    devServer: {
        port: 8082,
        hot: false,
        liveReload: true, // doesn't work
        overlay: true,
        watchContentBase: true
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        poll: 200
    }
};

