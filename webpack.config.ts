import path from "path";
import webpack from 'webpack';

const config: webpack.Configuration = {
    mode: "production",
    entry: './src/streamed-graph.ts',
    output: {
        filename: 'streamed-graph.bundle.js',
        path: path.resolve(__dirname, 'build')
    }, 
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
        ]
    }
};

export default config;