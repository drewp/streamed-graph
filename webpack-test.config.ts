import path from "path";
import webpack from 'webpack';
import { CheckerPlugin } from 'awesome-typescript-loader';

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
            use: ['awesome-typescript-loader'],
            exclude: /node_modules/
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
    new CheckerPlugin()
];
export default {
    name: "test",
    mode: "development",
    entry: [
        "./src/json_ld_quads_test.ts"
    ],
    output: {
        filename: "test.bundle.js",
        path: path.resolve(__dirname, 'build')
    },

    resolve: resolveConfig,
    module: moduleConfig,
    plugins: pluginsConfig
};

