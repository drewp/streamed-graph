const path = require("path");
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
    entry: ['./src/streamed-graph.ts'],
    output: {
        filename: 'streamed-graph.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: require.resolve('ts-loader'),
                options: PnpWebpackPlugin.tsLoaderOptions({
                    // ... regular options go there ...
                })
            },
            { test: /\.css$/i, use: ['file-loader'] },
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [
            PnpWebpackPlugin,
        ],
    },
    resolveLoader: {
        plugins: [
            PnpWebpackPlugin.moduleLoader(module),
        ],
    },
    watchOptions: {
        ignored: /node_modules/,
        poll: 200
    }
};
