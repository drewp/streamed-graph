import path from "path";
import webpack from 'webpack';

const config: webpack.Configuration = {
    mode: "development",
    entry: [
        './src/streamed-graph.ts',
        './src/streamed_graph_client.ts',
        
        './src/streamed-graph.css'   // doesn't emit anything
    ],
    output: {
        filename: 'streamed-graph.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        alias: {
            'webpack-plugin-serve/client': './node_modules/webpack-plugin-serve/client.js',
        },
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
            { test: /\.css$/i, use: ['file-loader'] },
        ],

    },
    devServer: {
        port: 8082,
        hot: false,
        liveReload: true, // doesn't work
        overlay: true,
        watchContentBase: true,
        // proxy: {
        //     '/rdf': {
        //         target: 'https://bigasterisk.com/',
        //         //pathRewrite: {'^/api' : ''}  
        //     }
        // },
    }
};

export default config;